import axios from 'axios';

const CLOUD_NAME = 'dfgrakdu8';

const UPLOAD_PRESETS: Record<'restaurante' | 'producto', string> = {
  restaurante: 'FotosRestaurantes',
  producto: 'FotosProductos'
};

export async function subirImagenCloudinary(
  file: File,
  tipo: 'restaurante' | 'producto'
): Promise<string> {
  const preset = UPLOAD_PRESETS[tipo];
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);

  const response = await axios.post(url, formData);
  return response.data.secure_url;
}
