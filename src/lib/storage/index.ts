export const storage = {
  upload: async (file: File, folder: string): Promise<string> => {
    return URL.createObjectURL(file);
  },
  deleteFile: async (url: string): Promise<void> => {
    return;
  },
};