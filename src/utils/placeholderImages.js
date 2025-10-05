// Tạo hình ảnh placeholder bằng canvas và chuyển thành data URI
export const createPlaceholderImage = (width, height, bgColor = '#ff6b35', textColor = '#ffffff', text = 'PycShop') => {
  // Tạo canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set kích thước
  canvas.width = width;
  canvas.height = height;
  
  // Vẽ background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Vẽ text
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Tính toán font size phù hợp
  const fontSize = Math.min(width, height) / 8;
  ctx.font = `${fontSize}px Arial`;
  
  // Vẽ text ở giữa
  ctx.fillText(text, width / 2, height / 2);
  
  // Trả về data URI
  return canvas.toDataURL('image/png');
};

// Các placeholder images phổ biến
export const PLACEHOLDER_IMAGES = {
  avatar100: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmY2YjM1Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QeWNTaG9wPC90ZXh0Pgo8L3N2Zz4K',
  
  avatar60: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZmY2YjM1Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QPC90ZXh0Pgo8L3N2Zz4K',
  
  avatar40: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmY2YjM1Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlA8L3RleHQ+Cjwvc3ZnPgo=',
  
  product200: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmY2YjM1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTA1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByb2R1Y3Q8L3RleHQ+Cjwvc3ZnPgo=',
  
  product400: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZmY2YjM1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByb2R1Y3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='
};

// Hàm để lấy placeholder image theo kích thước
export const getPlaceholderImage = (width, height, text = 'PycShop') => {
  const key = `${width}x${height}`;
  
  // Kiểm tra các size phổ biến
  if (width === 100 && height === 100) return PLACEHOLDER_IMAGES.avatar100;
  if (width === 60 && height === 60) return PLACEHOLDER_IMAGES.avatar60;
  if (width === 40 && height === 40) return PLACEHOLDER_IMAGES.avatar40;
  if (width === 200 && height === 200) return PLACEHOLDER_IMAGES.product200;
  if (width === 400 && height === 400) return PLACEHOLDER_IMAGES.product400;
  
  // Tạo dynamic cho các size khác
  return createPlaceholderImage(width, height, '#ff6b35', '#ffffff', text);
};