// Example static articles
const articles = [
  {
    title: "The Art of Silence in Sound Design",
    content: `Silence is not the absence of sound, but a powerful tool in the hands of a sound designer. In film and media, silence can create tension, highlight emotion, and give space for the story to breathe. Learn how to use silence as a creative element in your projects.

Silence is often misunderstood. Many believe it is simply the lack of noise, but in reality, it is a carefully crafted element that can shape the emotional landscape of a scene. In the hands of a skilled sound designer, silence becomes a canvas upon which every subtle sound, every breath, and every pause is painted with intention.

In suspenseful moments, silence can be deafening. It draws the audience in, making them hyper-aware of every small detail. The ticking of a clock, the distant hum of a city, or the gentle rustle of fabric can become monumental when surrounded by silence. This contrast heightens tension and anticipation, allowing the story to unfold with greater impact.

Silence also provides relief. After a cacophony of sound, a sudden drop into silence can be both shocking and soothing. It gives the audience a moment to process, to reflect, and to connect with the characters on a deeper level. In this way, silence is not just a break from sound, but an active participant in storytelling.

Great filmmakers and sound designers use silence to direct attention. By stripping away unnecessary noise, they guide the audience’s focus to what truly matters—be it a whispered confession, a single footstep, or the unspoken tension between characters. Silence, when used with purpose, can be more powerful than any musical score or sound effect.

In your own projects, experiment with silence. Don’t be afraid to let a scene breathe. Listen to the world around you and notice how moments of quiet can transform the way you perceive sound. Remember, in sound design, what you leave out is just as important as what you put in. Embrace the art of silence, and let it elevate your storytelling to new heights.`,
    tags: "sound design, film, silence, audio editing, mixing, post production, soundscape, dynamics, emotion, tension, storytelling, cinema, audio engineering, creative process, minimalism, space, atmosphere, quiet, suspense, film sound, sound art",
    picture: null
  },
  {
    title: "Field Recording: Capturing the World",
    content: `Field recording is the foundation of authentic sound design. From bustling cityscapes to remote natural environments, capturing real-world sounds brings depth and realism to your audio projects.`,
    tags: "field recording, nature, audio",
    picture: null
  },
  {
    title: "Mixing for Emotion: The Power of Balance",
    content: `A great mix is more than just technical perfection—it’s about conveying emotion. Learn how balancing levels, EQ, and effects can shape the listener’s emotional journey through a film or piece of music.`,
    tags: "mixing, emotion, balance, film sound, music production, audio engineering",
    picture: null
  },
  {
    title: "Creative Foley: Everyday Objects, Extraordinary Sounds",
    content: `Foley artists use everyday objects to create extraordinary sound effects. Discover the creative process behind foley and how it brings realism and magic to the screen.`,
    tags: "foley, sound effects, creativity, film, audio, sound design, post production",
    picture: null
  },
  {
    title: "Dialogue Editing: Clarity and Presence",
    content: `Dialogue is the heart of storytelling. Explore techniques for editing dialogue to ensure clarity, presence, and emotional impact in every scene.`,
    tags: "dialogue editing, clarity, presence, storytelling, film, audio editing, post production",
    picture: null
  },
  {
    title: "The Role of Ambience in Storytelling",
    content: `Ambience sets the mood and immerses the audience in the world of the story. Learn how to record, edit, and mix ambient sounds to enhance narrative depth and realism.`,
    tags: "ambience, storytelling, soundscape, film, audio, field recording, atmosphere",
    picture: null
  },
  {
    title: "Layering Sounds for Impact",
    content: `Layering is a key technique in sound design. By combining multiple sounds, you can create effects that are richer and more powerful than any single source. Learn how to layer and blend for maximum impact.`,
    tags: "layering, sound design, impact, audio, effects, creativity",
    picture: null
  },
  {
    title: "Sound Design for Animation",
    content: `Animation offers unique opportunities for sound designers. Explore how exaggerated and imaginative sounds can bring animated worlds to life and enhance storytelling.`,
    tags: "animation, sound design, creativity, storytelling, audio, effects",
    picture: null
  },
  {
    title: "Using Reverb to Create Space",
    content: `Reverb is more than an effect—it's a tool for creating a sense of space and depth. Discover how to use reverb to place sounds in a virtual environment and evoke emotion.`,
    tags: "reverb, space, depth, audio effects, mixing, sound design",
    picture: null
  },
  {
    title: "The Psychology of Sound in Film",
    content: `Sound influences how we feel and interpret stories. Learn about the psychological impact of sound choices in film and how to use them to guide audience emotions.`,
    tags: "psychology, sound, film, emotion, audience, storytelling",
    picture: null
  },
  {
    title: "Editing Sound for Trailers",
    content: `Trailers require punchy, attention-grabbing sound. Explore techniques for editing and designing sound specifically for trailers to maximize excitement and engagement.`,
    tags: "trailer, sound editing, excitement, engagement, film, audio",
    picture: null
  }
];

let blogCropper = null;
let blogCroppedDataUrl = null;
let articlesToShow = 3;

function updateBlogKeywordsMeta() {
  // Collect all tags from articles, split by comma, trim, and deduplicate
  const allTags = articles
    .map(article => article.tags)
    .join(',')
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0);
  const uniqueTags = Array.from(new Set(allTags));
  const meta = document.getElementById('blog-keywords-meta');
  if (meta) {
    meta.setAttribute('content', uniqueTags.join(', '));
  }
}

function renderArticles() {
  const list = document.querySelector('.blog-articles-list');
  list.innerHTML = '';
  if (articles.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'blog-empty-message';
    placeholder.textContent = 'Coming soon: personal articles, sound design stories, and case studies.';
    list.appendChild(placeholder);
    updateBlogKeywordsMeta();
    return;
  }
  // Show only the first N articles
  const visibleArticles = articles.slice(0, articlesToShow);
  visibleArticles.forEach(article => {
    const box = document.createElement('div');
    box.className = 'ARTICLE-BOX';
    box.innerHTML = `
      <div>
        <h2>${article.title}</h2>
        <p>${article.content}</p>
        <div class="article-tags">${article.tags}</div>
        <div class="article-picture-box">
          <svg class="blog-pink-rect" width="100%" height="100%" viewBox="0 0 80 7" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%;background:none;"><rect x="0" y="0" width="80" height="7" rx="0" fill="#FF4D6D"/></svg>
          ${article.picture ? `<img src="${article.picture}" alt="${article.title}" class="blog-article-img">` : ''}
        </div>
      </div>
    `;
    list.appendChild(box);
  });
  updateBlogKeywordsMeta();

  // Add LOAD MORE button if there are more articles to show
  let loadMoreBtn = document.getElementById('blog-load-more-btn');
  if (loadMoreBtn) loadMoreBtn.remove();
  if (articlesToShow < articles.length) {
    loadMoreBtn = document.createElement('button');
    loadMoreBtn.id = 'blog-load-more-btn';
    loadMoreBtn.className = 'bio-button';
    loadMoreBtn.textContent = 'LOAD MORE';
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.style.margin = '-4rem auto 2rem auto';
    loadMoreBtn.onclick = function() {
      articlesToShow += 3;
      renderArticles();
    };
    list.appendChild(loadMoreBtn);
  }
}

function renderAboutBlogPreview() {
  const previewDiv = document.getElementById('about-blog-preview');
  if (!previewDiv) return;
  if (!articles || articles.length === 0) {
    previewDiv.innerHTML = '<div style="color:#bbb;font-size:1.1rem;font-family:var(--body-font);">Coming soon: personal articles, sound design stories, and case studies.</div>';
    return;
  }
  const newest = articles[0];
  // Get first 2 lines (split by . or \n, fallback to first 120 chars)
  let lines = newest.content.split(/\n|\./).filter(Boolean);
  let previewText = lines.slice(0,2).join('. ') || newest.content.slice(0,120);
  if (!previewText.endsWith('.')) previewText += '...';
  previewDiv.innerHTML = `
    <div class="about-blog-preview-box">
      <div style="margin-bottom:0.5rem;font-size:1.08rem;font-family:var(--heading-font);color:var(--blue-main);font-weight:400;">${newest.title}</div>
      <div style="color:#bbb;font-size:1.05rem;font-family:var(--body-font);line-height:1.5;">${previewText}</div>
    </div>
  `;
}

function initBlogCropper() {
  const blogPicInput = document.getElementById('blog-picture');
  const blogCropperModal = document.getElementById('blog-cropper-modal');
  const blogCropperImage = document.getElementById('blog-cropper-image');
  const blogCropBtn = document.getElementById('blog-cropper-crop-btn');
  const blogCancelBtn = document.getElementById('blog-cropper-cancel-btn');
  const blogCloseBtn = document.getElementById('blog-cropper-close-btn');

  if (!blogPicInput) return;

  blogPicInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      blogCropperImage.src = evt.target.result;
      blogCropperImage.style.display = 'block';
      blogCropperImage.onload = function() {
        blogCropperModal.style.display = 'flex';
        if (blogCropper) {
          blogCropper.destroy();
          blogCropper = null;
        }
        blogCropper = new Cropper(blogCropperImage, {
          aspectRatio: 80/7,
          viewMode: 1,
          autoCropArea: 1,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          responsive: true,
          background: false,
        });
        // Add keyboard shortcuts
        document.addEventListener('keydown', blogCropperKeyHandler);
      };
    };
    reader.readAsDataURL(file);
  });

  function blogCropperKeyHandler(e) {
    if (blogCropperModal.style.display === 'flex') {
      if (e.key === 'Enter') {
        blogCropBtn.click();
      } else if (e.key === 'Escape') {
        blogCloseBtn.click();
      }
    }
  }

  blogCropBtn.addEventListener('click', function() {
    if (blogCropper) {
      const canvas = blogCropper.getCroppedCanvas({ width: 800, height: 70 });
      blogCroppedDataUrl = canvas.toDataURL('image/png');
      blogCropperModal.style.display = 'none';
      blogCropper.destroy();
      blogCropper = null;
      document.removeEventListener('keydown', blogCropperKeyHandler);
    }
  });

  blogCancelBtn.addEventListener('click', function() {
    blogCropperModal.style.display = 'none';
    if (blogCropper) {
      blogCropper.destroy();
      blogCropper = null;
    }
    blogPicInput.value = '';
    blogCropperImage.style.display = 'none';
    blogCroppedDataUrl = null;
    document.removeEventListener('keydown', blogCropperKeyHandler);
  });
  blogCloseBtn.addEventListener('click', function() {
    blogCropperModal.style.display = 'none';
    if (blogCropper) {
      blogCropper.destroy();
      blogCropper = null;
    }
    blogPicInput.value = '';
    blogCropperImage.style.display = 'none';
    blogCroppedDataUrl = null;
    document.removeEventListener('keydown', blogCropperKeyHandler);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderArticles();
  renderAboutBlogPreview();
  initBlogCropper();

  // Make about-blog-preview clickable to go to BLOG page
  const aboutBlogPreview = document.getElementById('about-blog-preview');
  if (aboutBlogPreview) {
    aboutBlogPreview.addEventListener('click', function() {
      if (typeof showPage === 'function') {
        showPage('blog-page', document.querySelector('.nav-menu a[href="#blog"]'));
        setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
      } else {
        // fallback: set location hash and scroll to top
        location.hash = '#blog';
        setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
      }
    });
  }

  const form = document.getElementById('blog-upload-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    const tags = document.getElementById('blog-tags').value;
    let picture = null;
    if (blogCroppedDataUrl) {
      picture = blogCroppedDataUrl;
    }
    // fallback: if no crop, use raw file
    else {
    const fileInput = document.getElementById('blog-picture');
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        picture = evt.target.result;
        articles.unshift({ title, content, tags, picture });
        renderArticles();
        form.reset();
          blogCroppedDataUrl = null;
      };
      reader.readAsDataURL(fileInput.files[0]);
        return;
      }
    }
      articles.unshift({ title, content, tags, picture });
      renderArticles();
      form.reset();
    blogCroppedDataUrl = null;
  });
}); 