import { tidbService } from './tidb';

export const testConnection = async () => {
  try {
    console.log('Testing TiDB Serverless connection...');
    
    // Test connection
    await tidbService.connect();
    console.log('✅ Connected to TiDB Serverless successfully!');
    
    // Test basic query
    const [rows] = await tidbService.connection.execute('SELECT COUNT(*) as count FROM incidents');
    console.log(`✅ Found ${(rows as any[])[0].count} incidents in database`);
    
    // Test vector search capabilities
    const [vectorRows] = await tidbService.connection.execute('SELECT COUNT(*) as count FROM incidents WHERE embedding IS NOT NULL');
    console.log(`✅ Found ${(vectorRows as any[])[0].count} incidents with vector embeddings`);
    
    // Test embedding generation
    console.log('Testing embedding generation...');
    const testEmbedding = await tidbService.generateEmbedding('test query');
    console.log(`✅ Embedding generation working - Generated embedding with ${testEmbedding.length} dimensions`);
    
    console.log('🎉 All connections successful! Your setup is ready.');
    
    await tidbService.disconnect();
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
};
