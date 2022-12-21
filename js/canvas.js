//Utils
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Star Klasse
class Star {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
      x: 0,
      y: 3
    }
    this.friction = 0.8;
    this.gravity = 0.2;
  }

  // Funktion um ein Stern zu zeichnen
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  // Funktion, welche Stern an bestimmter Position mit draw() zeichnet
  update() {
    this.draw()
    // Wenn der Stern das Screenende erreicht
    if (this.y + this.radius + this.velocity.y > canvas.height) {
      this.velocity.y = -this.velocity.y * this.friction
      this.shatter()
    } else {
      this.velocity.y += this.gravity
    }
    this.y += this.velocity.y
  }

  // Funktion um Stern "explodieren" zu lassen"
  // this ist für Star, nicht Ministar
  shatter() {
    for (let i = 0; i < 8; i++) {
      this.radius -= 2
      miniStars.push(new MiniStar(this.x, this.y, 2))
    }
  }
}

//MiniStar Klasse
class MiniStar {
  constructor(x, y, radius, color) {
   this.x = x
   this.y = y
   this.radius = radius
   this.color = color
   this.velocity = {
    x: randomIntFromRange(-5, 5),
    y: randomIntFromRange(-15, 15)
   }
   this.friction = 0.8;
   this.gravity = 0.1;
   // ttl: Time to live
   this.ttl = 200;
   this.opacity = 1
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(255, 0, 0, ${this.opacity})`
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    if (this.y + this.radius + this.velocity.y > canvas.height) {
      this.velocity.y = -this.velocity.y * this.friction
    } else {
      this.velocity.y += this.gravity
    }
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.ttl -= 1
    this.opacity -= 1 / this.ttl
  }
}

// Implementation
// Hintergrund gradient
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, "#171e26")
backgroundGradient.addColorStop(1, "#3f586b")

//Arrays, welche die Sterne beinhalten
let stars
let miniStars
function init() {
  // Array welcher alle aktuelle Sterne beinhaltet
  stars = []
  // Array welcher alle aktuelle Ministerne beinhaltet
  miniStars = []

  for (let i = 0; i < 1; i++) {
    stars.push(new Star(canvas.width / 2, 30, 30, 'blue'))
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = backgroundGradient
  c.fillRect(0, 0, canvas.width, canvas.height)

  stars.forEach((star, index) => {
    star.update()
    // Wenn radius kleiner gleich 0 ist, wird star aus dem array entfernt
    if (star.radius <= 0) {
      stars.splice(index, 1)
    }
  })
  miniStars.forEach((miniStar, index) => {
    miniStar.update()
    // Wenn ttl kliner gleich 0 ist, wird miniStar aus dem array entfernt
    if (miniStar.ttl <= 0) {
      miniStars.splice(index, 1)
    }
  })
}

init()
animate()