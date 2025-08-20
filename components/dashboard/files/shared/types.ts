interface FileData {
  id: string;
  name: string;
  description?: string;
  destination_url: string;
  tag?: string;
  created_at: string;
}

export type { FileData };
