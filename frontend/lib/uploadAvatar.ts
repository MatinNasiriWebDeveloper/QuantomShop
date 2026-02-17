export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await fetch('http://localhost:4000/api/upload/avatar', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('خطا در آپلود عکس');
    }

    const data = await response.json();
    return data.url; // آدرس عکس آپلود شده
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};