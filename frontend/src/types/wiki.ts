export interface Wiki {
  id: string;
  name: string;
  path: string;
  port: number;
  username: string;
  tags: string[];
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface WikiFormData {
  name: string;
  path: string;
  port: number;
  username: string;
  tags: string[];
  category: string;
  description: string;
}


