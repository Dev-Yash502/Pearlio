const frameCount = 240;
const images = [];
let loadedCount = 0;

const currentFrameIndex = { val: 0 };
const targetFrameIndex = { val: 0 };

const canvas = document.getElementById('animation-canvas');
const context = canvas.getContext('2d');

const progressPercent = document.getElementById('progress-percent');
const loader = document.getElementById('loader');

// Pad numbers to 3 digits (e.g., 1 -> '001', 24 -> '024')
const pad = (num) => String(num).padStart(3, '0');

// URL creator for frames
const frameUrl = (index) => `Frames/ezgif-frame-${pad(index)}.jpg`;

// Cover scaling logic (similar to CSS object-fit: cover)
const drawFrame = (index) => {
  const img = images[index];
  if (!img) return;

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;

  let drawWidth = canvas.width;
  let drawHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasRatio > imgRatio) {
    // Canvas is wider than image aspect ratio
    drawHeight = canvas.width / imgRatio;
    offsetY = (canvas.height - drawHeight) / 2;
  } else {
    // Canvas is taller than image aspect ratio
    drawWidth = canvas.height * imgRatio;
    offsetX = (canvas.width - drawWidth) / 2;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(Math.round(currentFrameIndex.val));
};

// Map scroll position to frame index
const handleScroll = () => {
  const scrollTop = window.scrollY;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
  
  targetFrameIndex.val = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
};

// Linear interpolation for smooth transitions
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

// Animation loop
const updateAnimation = () => {
  const diff = Math.abs(targetFrameIndex.val - currentFrameIndex.val);
  
  if (diff > 0.01) {
    currentFrameIndex.val = lerp(currentFrameIndex.val, targetFrameIndex.val, 0.12); // Buttery smooth scroll transitions
    drawFrame(Math.round(currentFrameIndex.val));
  } else if (currentFrameIndex.val !== targetFrameIndex.val) {
    currentFrameIndex.val = targetFrameIndex.val;
    drawFrame(Math.round(currentFrameIndex.val));
  }
  
  requestAnimationFrame(updateAnimation);
};

// Preload all frames before starting
const preloadImages = () => {
  return new Promise((resolve) => {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / frameCount) * 100);
        progressPercent.textContent = percent;
        
        if (loadedCount === frameCount) {
          loader.classList.add('fade-out');
          resolve();
        }
      };
      
      img.onerror = () => {
        console.error(`Error loading frame: ${frameUrl(i)}`);
        loadedCount++;
        if (loadedCount === frameCount) {
          loader.classList.add('fade-out');
          resolve();
        }
      };
      
      img.src = frameUrl(i);
      images.push(img);
    }
  });
};

// Initialize
preloadImages().then(() => {
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', handleScroll);
  
  // Set initial dimensions and draw the first frame
  resizeCanvas();
  
  // Start the render loop
  updateAnimation();
});
