import { Terminal, FileText, FolderOpen, Search, GitCommit } from 'lucide-react';

export const AGENT_URL = import.meta.env.VITE_AGENT_BACKEND_URL || 'https://cultivate-agent.drzach.ai';
export const PROJECT_ID = import.meta.env.VITE_AGENT_PROJECT_ID || 'cultivate-wellness';

export const WELCOME_MESSAGE =
  "Hi Dr. Zach! I can help you edit your website. Try things like:\n\n- **\"Update our Friday hours to 9am-5pm\"**\n- **\"Add a new patient testimonial\"**\n- **\"Change the tagline to something new\"**\n\nI can now read any file, search code, run builds, and deploy changes automatically. What would you like to change?";

export const TOOL_META: Record<string, { label: string; icon: typeof Terminal }> = {
  read_file: { label: 'Reading file', icon: FileText },
  write_file: { label: 'Writing file', icon: FileText },
  edit_file: { label: 'Editing file', icon: FileText },
  list_directory: { label: 'Listing directory', icon: FolderOpen },
  search_files: { label: 'Searching', icon: Search },
  run_command: { label: 'Running command', icon: Terminal },
  git_commit_and_push: { label: 'Committing & pushing', icon: GitCommit },
};

export const QUICK_ACTIONS = [
  'Update office hours',
  'Add a testimonial',
  'Change the tagline',
  'Update contact info',
];

export const DEPLOY_COUNTDOWN_SECONDS = 90;
