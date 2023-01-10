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

//const footer = document.getElementsByClassName("footer");
//const footerPosition = footer.getBoundingClientRect();
//const footerHeigh = footerPosition.height;

canvas.width = innerWidth
canvas.height = innerHeight

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
      x: (Math.random() - 0.5) * 8,
      y: 3
    }
    this.friction = 0.6;
    this.gravity = 0.2;
  }

  // Funktion um ein Stern zu zeichnen
  draw() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    //c.shadowColor = "#E3EAEF"
    //c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
  }

  // Funktion, welche Stern an bestimmter Position mit draw() zeichnet
  update() {
    this.draw()
    // Wenn der Stern das Screenende erreicht
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      this.velocity.y = -this.velocity.y * this.friction
      this.shatter()
    } else {
      this.velocity.y += this.gravity
    }
    this.x += this.velocity.x
    this.y += this.velocity.y
  }

  // Funktion um Stern "explodieren" zu lassen"
  // this ist für Star, nicht Ministar
  shatter() {
    for (let i = 0; i < 4; i++) {
      this.radius -= canvas.width/600
      miniStars.push(new MiniStar(this.x, this.y, canvas.width/800))
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
   this.friction = 0.6;
   this.gravity = 0.2;
   // ttl: Time to live
   this.ttl = 200;
   this.opacity = 1
  }

  draw() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(227, 234, 239, ${this.opacity})`
    //c.shadowColor = "#E3EAEF"
    //c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
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

function createMountainRange(mountainAmount, height, color) {
  for (let i = 0; i < mountainAmount; i++) {
    const mountainWidth = canvas.width / mountainAmount
    c.beginPath()
    c.moveTo(i * mountainWidth, canvas.height)
    c.lineTo(i * mountainWidth + mountainWidth + 350, canvas.height)
    c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height-height)
    c.lineTo(i * mountainWidth - 350, canvas.height)
    c.fillStyle = color
    c.fill()
    c.closePath()
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
let backgroundStarts
let ticker = 0
let randomSpawnRate = 250
const groundHeight = canvas.height / 10
function init() {
  // Array welcher alle aktuelle Sterne beinhaltet
  stars = []
  // Array welcher alle aktuelle Ministerne beinhaltet
  miniStars = []
  backgroundStars = []

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 3
    backgroundStars.push(new Star(x, y, radius, "white"))
  }
}
// Animation Loop
function animate() {
  requestAnimationFrame(animate)

  c.fillStyle = backgroundGradient
  c.fillRect(0, 0, canvas.width, canvas.height)

  backgroundStars.forEach(backgroundStar => {
    backgroundStar.draw()
  })

  createMountainRange(1, canvas.height - 50, "#384551")
  createMountainRange(2, canvas.height - 100, "#2B3843")
  createMountainRange(3, canvas.height - 300, "#26333E")
  // "Boden" am Fussende der Seite
  c.fillStyle = "#182028"
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

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

  ticker++
  
  if (ticker % randomSpawnRate == 0) {
    const x = Math.random() * canvas.width
    stars.push(new Star(x, -100, canvas.width/100, "#E3EAEF"))
    randomSpawnRate = Math.floor(Math.random() * (750 - 500 + 1) + 500)
  }
}

init()
animate()