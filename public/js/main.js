

class Main extends Phaser.Scene{

    constructor(){
        super('Main');
    }

    create(){
        console.log('hello world');
        this.title = this.add.text(game.config.width/2, 150, 'Tic Tac Toe',{'fontSize': '36px'}).setOrigin(.5,.5);
        this.title.tint = 0x000000;

        //Graphics ...Draw lines to visualize the grid
        var graphicsconfig = {
            lineStyle: {
                color: 0x000000,
                alpha : 1,
                width: 15,
            },
            fillStyle: {
                color : 0x000000,
                alpha : 1
            },
        };
        this.graphicsObj = this.add.graphics(graphicsconfig);
        
       this.graphicsObj.strokeLineShape(new Phaser.Geom.Line(game.config.width/2 - 150, game.config.height/3 + 50, game.config.width/2 +150, game.config.height/3 + 50));
       this.graphicsObj.strokeLineShape(new Phaser.Geom.Line(game.config.width/2 - 150, game.config.height/3 + 150, game.config.width/2 +150, game.config.height/3 + 150));
       this.graphicsObj.strokeLineShape(new Phaser.Geom.Line(game.config.width/2 - 50, game.config.height/3 - 50, game.config.width/2 - 50, game.config.height/3 + 250));
       this.graphicsObj.strokeLineShape(new Phaser.Geom.Line(game.config.width/2 + 50, game.config.height/3 - 50, game.config.width/2 +50, game.config.height/3 + 250));
      
        //2D Grid
        //0 is unused, 1 is X, 2 is 0
        //Initialize
        this.grid = [[]];
        for(let i = 0 ; i < 3 ; i++){
            this.grid[i] = [];
            for(let j = 0 ; j < 3 ; j++){
                let x = game.config.width/3 + j * 100;
                let y = game.config.height/3 + i * 100;
                let cell = this.add.text(x,y,'Q',{'fontSize': '100px'}).setOrigin(.5,.5);
                cell.tint = 0xffffff;
                cell.setInteractive();
                cell.name =  '' + i + j;
                this.grid[i][j] = {
                    c : cell,
                    v : 0,
                }
            }
        }

        console.log(this.grid);

        //Player's turn first, Player ===>> 1, CPU ===> 2
        this.turn = 1;
        this.playerVal = 0;

        //Set Input
        this.input.on('gameobjectdown' , (pointer, gameobject) => {
            console.log('here');
            if(this.turn == 1){
                console.log('now here');
                this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.text = "X";
                this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.tint = 0xff0000;

                this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].v = 1;
                this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.setInteractive(false);
            
                this.turn = 2;
                this.time.addEvent({
                    delay: 500,
                    callback:() => { 
                        this.playCPU();
                      
                    },
                    loop:false,
                },this);

            }
        });

        this.restart = this.add.text(game.config.width/2, game.config.height* 2/3 +100, 'Restart', {'fontSize': '40px'}).setOrigin(.5,.5);
        this.restart.setInteractive().on('pointerdown', () => {
            this.scene.start(this);
        });
        this.restart.tint = 0xff0000;

        
        this.winner = this.add.text(game.config.width/2, game.config.height* 2/3, 'You Win', {'fontSize': '60px'}).setOrigin(.5,.5);
        this.winner.setVisible(false);
        this.winner.tint = 0x0000ff;
    }

    playCPU(){
        //console.log('cpus turn');
        let x = Phaser.Math.Between(0,2);
        let y = Phaser.Math.Between(0,2);
        if(this.grid[x][y].v == 1 || this.grid[x][y].v == 2){
            this.playCPU();
            console.log('called again');
        }
        else{
            this.grid[x][y].c.text = "0";
            this.grid[x][y].c.tint = 0x0000ff;
            this.grid[x][y].v = 2;
            this.grid[x][y].c.setInteractive(false);
            this.turn = 1;
            console.log('cpus turn over' + this.turn);
        }
        
    }

    update(){
        if(this.gameRules(this.grid, 1)){
            console.log('You Win');
            this.winner.text = 'You Win!!!!';
            this.winner.setVisible(true);
            this.turn = 0;

        }
        else if(this.gameRules(this.grid , 2)){
            this.winner.text = 'CPU Wins :(((';
            this.winner.setVisible(true);
            console.log('cpu wins');
            this.turn = 0;
        }
       
    }


    gameRules(grid,s1){
        //Takes in the current state of the grid as the input
        if(grid[0][0].v == s1 && grid[0][1].v == s1 && grid[0][2].v == s1 ||
            grid[1][0].v == s1 && grid[1][1].v == s1 && grid[1][2].v == s1 ||
            grid[2][0].v == s1 && grid[2][1].v == s1 && grid[2][2].v == s1 || 

            grid[0][0].v == s1 && grid[1][0].v == s1 && grid[2][0].v == s1 ||
            grid[0][1].v == s1 && grid[1][1].v == s1 && grid[2][1].v == s1 ||
            grid[0][2].v == s1 && grid[1][2].v == s1 && grid[2][2].v == s1 || 

            grid[0][0].v == s1 && grid[1][1].v == s1 && grid[2][2].v == s1 ||
            grid[0][2].v == s1 && grid[1][1].v == s1 && grid[2][0].v == s1
            ){
                return true;
            }
            else{
                return false;
            }
    }

};

var config = {
    parent:'tictactoe',
    type: Phaser.AUTO,
    width: 600,
    height: 1200,
    backgroundColor: 0xffffff,
    scene: Main,
    scale: {
        mode: Phaser.Scale.FIT  ,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

var game = new Phaser.Game(config);