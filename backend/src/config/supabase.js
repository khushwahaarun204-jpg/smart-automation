const { createClient } = require('@supabase/supabase-js');
const config = require('./index');

const supabaseUrl = config.supabase.url || process.env.SUPABASE_URL;
const supabaseKey = config.supabase.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Test connectivity to the database
 */
const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return {
        connected: false,
        error: error.message
      };
    }

    return {
      connected: true,
      provider: 'Supabase PostgreSQL'
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
};

module.exports = {
  supabase,
  checkDatabaseConnection
};
