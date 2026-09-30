const { supabase } = require('../config/supabase');

/**
 * User Model: Data access layer for `users` table
 */
class UserModel {
  /**
   * Find a user by email, including password_hash for authentication
   */
  static async findByEmailWithPassword(email) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, role, department, is_active, created_at, updated_at')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Find user by ID, safely omitting password_hash
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, department, is_active, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Check if an email is already registered
   */
  static async existsByEmail(email) {
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('email', email.toLowerCase().trim());

    if (error) {
      throw error;
    }
    return count > 0;
  }

  /**
   * Create a new user record
   */
  static async create({ name, email, passwordHash, role = 'employee', department = null }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role,
        department: department ? department.trim() : null,
        is_active: true
      })
      .select('id, name, email, role, department, is_active, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }
    return data;
  }
}

module.exports = UserModel;
