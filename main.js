// import our three.js reference
const THREE = require( 'three' )

const app = {
  init() {
    this.debug = true
    this.once = false
    this.gridSize = 15
    
    this.geometries = []
    this.meshes = []
    
    this.currentGrid = []
    this.nextGrid = []
    this.liveNeighborMap = []
    
    // Asssign random values to each cell initially 
    for (let i = 0; i < this.gridSize; i++) {
        this.currentGrid[i] = []
        this.nextGrid[i] = []
        for (let j = 0; j < this.gridSize; j++) {
          this.currentGrid[i][j] = []
          this.nextGrid[i][j] = []
          for (let k = 0; k < this.gridSize; k++) {
            this.currentGrid [i][j][k] = Math.random() > .5 ? 1 : 0
            this.nextGrid[i][j][k] = 0
          }
        }
    }
    
    
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,  // FOV 
      window.innerWidth / window.innerHeight, // aspect ratio
      .1,  // near plane
      1000 // far plane
    )
    
    this.camera.position.z = 5
    this.camera.position.x = 2.5
    this.camera.position.y = 1
    
	this.createRenderer()
    this.createLights()
    
    const material = new THREE.MeshPhongMaterial({ color:0x009999 })
    const materialDead = new THREE.MeshPhongMaterial({ color:0x404040 })
    
    // Make grid of geometry
    for (let i = 0; i < this.gridSize; i++) {
      this.geometries[i] = []
      this.meshes[i] = []
      
      for ( let j = 0; j < this.gridSize; j++ ){
        this.geometries[i][j] = []
        this.meshes[i][j] = []
        
        for ( let k = 0; k < this.gridSize; k++ ){
          this.geometries[i][j][k] = new THREE.IcosahedronGeometry( .5, 0 )
          if (this.currentGrid[i][j][k] == 0)
            this.meshes[i][j][k] = new THREE.Mesh( this.geometries[i][j][k], materialDead )
          if (this.currentGrid[i][j][k] == 1)
            this.meshes[i][j][k] = new THREE.Mesh( this.geometries[i][j][k], material )
        }
      }
    }
    
    // add all to scene
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++){
        for (let k = 0; k < this.gridSize; k++){
          this.scene.add ( this.meshes[i][j][k] )
        }
      }
    }
    
    
    this.render()
  },
  
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
	  document.body.appendChild( this.renderer.domElement )
    this.render = this.render.bind( this )
  },
  
  createLights() {
    this.pointLight = new THREE.PointLight( 0xffffff, .5 )
    this.pointLight.position.z = 50
    this.scene.add( this.pointLight )
    
    this.ambLight = new THREE.AmbientLight( 0x404040 )
    this.scene.add( this.ambLight )
    
  },
  
//  animate() {
//    for (let i = 0; i < this.gridSize; i++) {
//      this.liveNeighborMap[i] = []
//
//      for (let j = 0; j < this.gridSize; j++) {
//        this.liveNeighborMap[i][j] = 0
//
//        //check 4 directions
//        if (i !== 0 && this.currentGrid[i-1][j] === 1) this.liveNeighborMap[i][j]++  //left 
//        if (i+1 !== this.gridSize && this.currentGrid[i+1][j] === 1) this.liveNeighborMap[i][j]++ //right
//        if (j !== 0 && this.currentGrid[i][j-1] === 1) this.liveNeighborMap[i][j]++  //up 
//        if (j+1 !== this.gridSize && this.currentGrid[i][j+1] === 1) this.liveNeighborMap[i][j]++ //down  
//      }
//    }
//
//    if (this.debug) {
//      if (!this.once) {
//        console.log(this.liveNeighborMap)
//        this.once = true
//      }
//    }
//
//
//    // Determine nextGrid
//    for (let i = 0; i < this.gridSize; i++) {
//      this.nextGrid[i] = []
//
//      for (let j = 0; j < this.gridSize; j++) {
//        if (this.currentGrid[i][j] === 0){ // DEAD
//          if (this.liveNeighborMap[i][j] === 3) {
//            this.nextGrid[i][j] = 1
//          }
//          else {
//            this.nextGrid[i][j] = 0
//          }
//        }
//
//        if (this.currentGrid[i][j] === 1) { //ALIVE
//          if (this.liveNeighborMap[i][j] < 2) {
//            this.nextGrid[i][j] = 0
//          } 
//          else if (this.liveNeighborMap[i][j] > 3) {
//            this.nextGrid[i][j] = 0
//          } 
//          else {  // 2 or 3
//            this.nextGrid[i][j] = 1
//          } 
//        }          
//      }
//    }
//
////    if (debug) {
////      if (!once2) {
////        console.log(nextGrid)
////        once2 = true
////      }
////    }
//
//    let swap = this.currentGrid
//    this.currentGrid = this.nextGrid
//    this.nextGrid = swap
//
//  },
  
  render() {
    window.requestAnimationFrame( this.render )
    //this.animate()
    
    // change positions
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++){
        for (let k = 0; k < this.gridSize; k++) {
          this.meshes[i][j][k].position.y = j
          this.meshes[i][j][k].position.z = -k
          
          this.meshes[i][j][k].rotation.x += .005
          this.meshes[i][j][k].rotation.y += .005

          // change to correct color
          if ( this.currentGrid[i][j][k] == 0 )  // if dead
            this.meshes[i][j][k].material.color.setHex( 0x404040 )
          else if ( this.currentGrid[i][j][k] == 1 ) // if alive
             this.meshes[i][j][k].material.color.setHex( 0x999900 )

          if (i == 0) {
            this.meshes[i][j][k].position.x = 0
            continue
          }
          this.meshes[i][j][k].position.x = this.meshes[i - 1][j][k].position.x + 1
        
        }
      }
    }   
    
    this.renderer.render( this.scene, this.camera )  
  }
}

window.onload = ()=> app.init()