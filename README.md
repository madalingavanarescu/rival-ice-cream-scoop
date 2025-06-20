# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/6c81f9f4-d787-4936-be65-4698f516159a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6c81f9f4-d787-4936-be65-4698f516159a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Create environment variables file
cp .env.example .env
# Add your Kit API key to .env file:
# VITE_KIT_API_KEY=your_kit_api_key_here

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Kit API Configuration (required for waitlist signup)
VITE_KIT_API_KEY=your_kit_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Kit API Setup

1. Sign up for a [Kit account](https://kit.com)
2. Go to Account Settings > API Keys
3. Create a new API key with subscriber permissions
4. Add the API key to your `.env` file
5. Create a list in Kit for your waitlist subscribers
6. Set up double opt-in and automated email sequences in Kit

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6c81f9f4-d787-4936-be65-4698f516159a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
