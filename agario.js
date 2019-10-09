const canvas_height = innerHeight
const canvas_width = innerWidth
const canvas_element = document.querySelector('canvas')
canvas_element.height = canvas_height
canvas_element.width = canvas_width

function returnRandomNumber(){
    return Math.random() * 256
}

function generateRandomColor(){
    return `rgb(${returnRandomNumber()},${returnRandomNumber()},${returnRandomNumber()})`
}

const canvas = canvas_element.getContext('2d')

function Enemy(x,y,radius,index,speed){
    this.x = x
    this.y = y
    this.radius = radius
    this.index = index
    this.area = Math.PI * (this.radius*this.radius)
    this.speed = speed
    this.distance_from_player = 0
    this.fillColor = generateRandomColor()
    this.borderCollor = generateRandomColor()

    this.draw = function(){
        canvas.beginPath()
        canvas.arc(this.x,this.y,this.radius,0,Math.PI * 2,false)
        canvas.strokeStyle = this.fillColor
        canvas.fillStyle = this.borderCollor
        canvas.fill()
        canvas.lineWidth = this.radius/2
        canvas.fillStyle = 'red'
        canvas.stroke()
    }

    this.move = function(){
        let distance_x = this.x - player.x
        let distance_y = this.y - player.y
        this.distance_from_player = Math.sqrt(distance_x*distance_x + distance_y*distance_y)
        if(this.distance_from_player>this.speed){
            distance_x *= this.speed/this.distance_from_player
            distance_y *= this.speed/this.distance_from_player
        }
        if(player.area > this.area*2){
            this.x += distance_x
            this.y += distance_y
        }
        else{
            this.x -= distance_x
            this.y -= distance_y
        }
        
        if(this.x+this.radius >= canvas_width){
            this.x = canvas_width - this.radius
        }
        else if(this.x - this.radius <= 0){
            this.x = this.radius
        }

        if(this.y+this.radius >= canvas_height){
            this.y = canvas_height - this.radius
        }
        else if(this.y - this.radius <= 0){
            this.y = this.radius
        }
    }

    this.checkProximity = function(player){
        if(this.distance_from_player <= (this.radius + player.radius)){
            if(player.area > this.area*2){
                player.area += this.area
                this.kill()
                player.calculate_radius()
            }
            else if(this.area > player.area*2){
                player.kill()
            }
        }
    }

    this.update = function(player){
        this.move()
        this.checkProximity(player)
        this.draw()
    }

    this.kill = function(){
        delete enemies[this.index]
    }
}

function Player(x,y,radius,color=null){
    const that = this
    this.x = x
    this.y = y
    this.mouseX = 0
    this.mouseY = 0
    this.radius = radius
    this.speed = 5
    this.area = Math.PI * (this.radius*this.radius)
    this.color = generateRandomColor()
    if(color==null){
        this.color = generateRandomColor()
    }else{
        this.color = color
    }

    this.draw = function(){
        canvas.beginPath()
        canvas.arc(this.x,this.y,this.radius,0,Math.PI * 2,false)
        canvas.strokeStyle = this.color
        canvas.fillStyle = this.color
        canvas.stroke()
        canvas.fill()
    }
    
    this.calculate_radius = function(){
        let division = this.area/Math.PI
        this.radius = Math.sqrt(division)
    }

    canvas_element.addEventListener('mousemove',function(e){
        that.mouseX = e.pageX
        that.mouseY = e.pageY
    })

    this.update = function(){
        let distance_x = (this.mouseX - this.x) * .125
        let distance_y = (this.mouseY - this.y) * .125

        let distance = Math.sqrt(distance_x*distance_x + distance_y*distance_y)

        if(distance>this.speed){
            distance_x *= this.speed/distance
            distance_y *= this.speed/distance
        }

        this.x += distance_x
        this.y += distance_y

        this.draw()
    }

    this.kill = function(){
        this.radius = 0
        this.area = 0
        this.speed = 0
    }
}

let player = new Player(100,100,10,'black')

let enemies = []

function generateEnemies(count){
    for(let i = 0; i< count;i++){
        let x = (Math.random() * canvas_width ) +200
        let y = (Math.random() * canvas_height) +200
        let radius = Math.random() * 25
        let factor = 1
        if(radius<5){
            factor = 2
        }
        let speed = Math.random() * 4*factor
        let enemy = new Enemy(x,y,radius,i,speed)
        enemies.push(enemy)
    }
}

function run(){
    canvas.clearRect(0,0,canvas_width,canvas_height)
    enemies.map(enemy=>{
        enemy.update(player)
    })
    player.update()
    document.querySelector('p#area > span').textContent = parseInt(player.area)
    requestAnimationFrame(run)
}

generateEnemies(100)
run()
