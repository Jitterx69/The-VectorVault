# TiDB Serverless Setup Guide

## Prerequisites

1. **TiDB Serverless Account**: Sign up at [TiDB Cloud](https://tidbcloud.com)
2. **Node.js 18+**: Ensure you have Node.js installed
3. **OpenAI Integration**: Currently disabled - using local hash-based embeddings

## Step 1: Get Your TiDB Serverless Credentials

1. Log into your TiDB Cloud account
2. Navigate to your Serverless cluster
3. Click on "Connect" to get connection details
4. Note down:
   - **Host**: `your-cluster.tidbcloud.com`
   - **Port**: `4000`
   - **Username**: Your database username
   - **Password**: Your database password
   - **Database**: `test` (or your preferred database name)

## Step 2: OpenAI Integration (Optional)

**Note**: OpenAI integration is currently disabled. The application uses local hash-based embeddings for vector search.

To enable OpenAI integration later:
1. Log into your OpenAI account
2. Go to [API Keys](https://platform.openai.com/api-keys)
3. Create a new API key
4. Add `VITE_OPENAI_API_KEY=your-key` to your `.env` file

## Step 3: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual credentials:

```env
# TiDB Serverless Configuration
VITE_TIDB_HOST=your-actual-host.tidbcloud.com
VITE_TIDB_PORT=4000
VITE_TIDB_USER=your-actual-username
VITE_TIDB_PASSWORD=your-actual-password
VITE_TIDB_DATABASE=test

# Application Configuration
VITE_APP_ENV=development
```

## Step 4: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to **Settings** → **Database Management**

3. Click **"Test Connection"** to verify:
   - TiDB Serverless connection
   - Local embedding generation
   - Database schema validation

## Step 5: Seed Sample Data

1. In the Database Management section, click **"Seed Sample Data"**
2. This will populate your database with 10 realistic security incidents
3. Each incident will be automatically vectorized for semantic search

## Step 6: Verify Vector Search

1. Navigate to **Vector Search** page
2. Enter a search query like: "DDoS attack on web servers"
3. You should see relevant results with similarity scores

## Troubleshooting

### Connection Failed
- Verify your TiDB credentials are correct
- Check if your TiDB cluster is running
- Ensure your IP is whitelisted in TiDB Cloud

### Embedding Generation Error
- Check if the local embedding generation is working
- Verify the hash-based embedding algorithm
- Check browser console for errors

### Vector Search Not Working
- Check if the vector index was created successfully
- Verify sample data was seeded properly
- Check browser console for errors

### Environment Variables Not Loading
- Restart your development server after updating `.env`
- Ensure `.env` file is in the project root
- Check that variable names start with `VITE_`

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific database credentials
- Regularly rotate your database passwords
- Monitor your database usage and costs

## Next Steps

Once connected successfully:
1. Explore the Vector Search functionality
2. Create new incidents through the application
3. Test advanced filtering options
4. Monitor search analytics in the dashboard

Your Incident Guard AI application is now fully connected to TiDB Serverless! 🎉
