const imageUrls = [
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1000&q=85',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1000&q=85',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000&q=85',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&q=85',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&q=85'
];

const descriptions = [
  'Waterfall surrounded by green forest',
  'Mountain valley in soft sunlight',
  'Lake and mountains reflected in the water',
  'Sunlit forest with tall trees',
  'Snowy mountains beneath the clouds'
];


function changeImage(direction) {

  const currentImage = document.querySelector('.carousel-image');

  const currentIndex = Number(currentImage.id);

  let nextIndex = currentIndex + direction;

  if (nextIndex >= imageUrls.length) {
    nextIndex = 0;
  }

  if (nextIndex < 0) {
    nextIndex = imageUrls.length - 1;
  }

  const newImage = document.createElement('img');

  newImage.className = 'carousel-image';

  newImage.id = String(nextIndex);

  newImage.src = imageUrls[nextIndex];

  newImage.alt = descriptions[nextIndex];

  currentImage.replaceWith(newImage);

  document.getElementById('image-count').textContent =
    `${nextIndex + 1} / ${imageUrls.length}`;
}



function toggleLike() {

  const button = document.getElementById('like-button');
  const heart = document.getElementById('heart');

  const liked = button.getAttribute('aria-pressed') === 'true';

  button.setAttribute('aria-pressed', String(!liked));

  button.setAttribute(
    'aria-label',
    liked ? 'Like post' : 'Unlike post'
  );

  heart.textContent = liked ? '♡' : '♥';

  heart.classList.toggle('liked', !liked);
}



const carousel = document.getElementById('carousel');

let touchStartX = null;

carousel.addEventListener('touchstart', (event) => {

  touchStartX = event.changedTouches[0].screenX;

}, { passive: true });


carousel.addEventListener('touchend', (event) => {

  if (touchStartX === null) {
    return;
  }

  const distance =
    event.changedTouches[0].screenX - touchStartX;

  if (Math.abs(distance) > 45) {

    changeImage(distance < 0 ? 1 : -1);

  }

  touchStartX = null;

}, { passive: true });



document.addEventListener('keydown', (event) => {

  if (event.key === 'ArrowRight') {
    changeImage(1);
  }

  if (event.key === 'ArrowLeft') {
    changeImage(-1);
  }

});
