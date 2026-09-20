import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Position, LeaderboardEntry } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-public-key-here'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// Database Helper Methods
// ==========================================

export class SupabaseService {
  /**
   * Get or create a user in the database
   */
  public async syncUser(address: string, initialBalance: number = 1000): Promise<{ balance: number; username: string }> {
    if (!supabase || !isSupabaseConfigured) {
      return { balance: initialBalance, username: address.slice(0, 6) };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('balance, username')
        .eq('address', address)
        .single();

      if (error && error.code === 'PGRST116') {
        // User not found, insert new user
        const newUsername = 'Trader_' + address.slice(2, 6);
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            address,
            username: newUsername,
            balance: initialBalance
          })
          .select()
          .single();

        if (insertError) {
          console.warn('Supabase insert user error:', insertError);
          return { balance: initialBalance, username: newUsername };
        }
        return { balance: Number(newUser.balance), username: newUser.username };
      }

      if (data) {
        return { balance: Number(data.balance), username: data.username };
      }
    } catch (err) {
      console.warn('Supabase syncUser caught error:', err);
    }

    return { balance: initialBalance, username: address.slice(0, 6) };
  }

  /**
   * Save a newly placed position to Supabase
   */
  public async savePosition(pos: Position, userAddress: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;

    try {
      const { error } = await supabase.from('positions').insert({
        id: pos.id,
        user_address: userAddress,
        asset_symbol: pos.assetSymbol,
        asset_name: pos.assetName,
        direction: pos.direction,
        amount: pos.amount,
        strike_price: pos.strikePrice,
        payout_multiplier: pos.payoutMultiplier,
        potential_payout: pos.potentialPayout,
        duration_seconds: pos.durationSeconds,
        status: 'ACTIVE',
        created_at: new Date(pos.createdAt).toISOString(),
        expires_at: new Date(pos.expiresAt).toISOString()
      });

      if (error) {
        console.warn('Supabase savePosition error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase savePosition error:', err);
      return false;
    }
  }

  /**
   * Settle a position in Supabase and update user balance
   */
  public async settlePosition(
    posId: string,
    userAddress: string,
    closePrice: number,
    isWon: boolean,
    payout: number,
    newBalance: number
  ): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;

    try {
      // 1. Update position status
      await supabase
        .from('positions')
        .update({
          close_price: closePrice,
          payout,
          status: isWon ? 'WON' : 'LOST'
        })
        .eq('id', posId);

      // 2. Update user balance
      await supabase
        .from('users')
        .update({ balance: newBalance, last_active: new Date().toISOString() })
        .eq('address', userAddress);

      // 3. Record transaction
      await supabase.from('transactions').insert({
        user_address: userAddress,
        type: isWon ? 'TRADE_PAYOUT' : 'TRADE_ENTRY',
        amount: isWon ? payout : 0
      });

      return true;
    } catch (err) {
      console.warn('Supabase settlePosition error:', err);
      return false;
    }
  }

  /**
   * Update balance on deposit or withdraw
   */
  public async updateBalance(userAddress: string, newBalance: number, type: 'DEPOSIT' | 'WITHDRAW', amount: number): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;

    try {
      await supabase
        .from('users')
        .update({ balance: newBalance, last_active: new Date().toISOString() })
        .eq('address', userAddress);

      await supabase.from('transactions').insert({
        user_address: userAddress,
        type,
        amount
      });
      return true;
    } catch (err) {
      console.warn('Supabase updateBalance error:', err);
      return false;
    }
  }

  /**
   * Fetch historical and active positions for a user
   */
  public async fetchUserPositions(userAddress: string): Promise<Position[]> {
    if (!supabase || !isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('user_address', userAddress)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data) return [];

      return data.map(item => ({
        id: item.id,
        assetSymbol: item.asset_symbol,
        assetName: item.asset_name,
        direction: item.direction,
        amount: Number(item.amount),
        strikePrice: Number(item.strike_price),
        closePrice: item.close_price ? Number(item.close_price) : undefined,
        payoutMultiplier: Number(item.payout_multiplier),
        potentialPayout: Number(item.potential_payout),
        payout: item.payout ? Number(item.payout) : undefined,
        durationSeconds: item.duration_seconds,
        createdAt: new Date(item.created_at).getTime(),
        expiresAt: new Date(item.expires_at).getTime(),
        status: item.status
      }));
    } catch (err) {
      console.warn('Supabase fetchUserPositions error:', err);
      return [];
    }
  }

  /**
   * Fetch daily leaderboard
   */
  public async fetchLeaderboard(): Promise<LeaderboardEntry[] | null> {
    if (!supabase || !isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('volume', { ascending: false })
        .limit(10);

      if (error || !data || data.length === 0) return null;

      return data.map((d, index) => ({
        rank: index + 1,
        address: d.user_address,
        username: d.username,
        volume: Number(d.volume),
        pnl: Number(d.pnl),
        winRate: Number(d.win_rate),
        prize: Number(d.prize)
      }));
    } catch (_) {
      return null;
    }
  }
}

export const supabaseService = new SupabaseService();
