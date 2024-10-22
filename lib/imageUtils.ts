export const validateImage = (
  file: File,
  callback: (isValid: boolean, errorMessage?: string) => void,
) => {
  if (file.size > 5 * 1024 * 1024) {
    callback(false, "Files must be less than 5 MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const image = new Image();
    image.onload = () => {
      // if (image.width !== image.height) {
      //   callback(false, "Only 1x1 images are accepted.");
      //   return;
      // }

      callback(true);
    };
    image.onerror = () => {
      callback(false, "The file could not be read as an image.");
    };
    image.src = e.target?.result as string;
  };
  reader.onerror = () => {
    callback(false, "There was an error read the file.");
  };
  reader.readAsDataURL(file);
};
