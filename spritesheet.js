

// Takes as arguments: Dict of files to use as spritesheets mapped to their shortcut,
// size of individual sprite, callback fn



//ex sheets var:
//
//

var Sprites = {
    cache :      {},
    seenBefore : {},
    ordered :    [],
	sheets  :    [], 

    //returns true on success, false on dupe
    add : function(dat, x, y, sheet){

        var imgdata = dat.getContext('2d').getImageData(0,0,globals.tileWidth,globals.tileWidth).data;
        var stringdata  = "";
        for (p in imgdata){
            stringdata += imgdata[p];
        }
        if (!this.seenBefore[stringdata]){ 
           this.cache[x+","+y+","+sheet] = dat; 
           this.seenBefore[stringdata] = true;

           this.ordered.push([x,y,sheet]); 
           return true;
        } 
       return false;
    },
    get : function(x, y, sheet){
        return this.cache[x+","+y+","+sheet]; 
    },
    getNth : function(n){
        return this.ordered[n];
    }, 
    getOrderedList : function(){
        return this.ordered;
    },
    loadSpriteFile : function(f, cb) {
        this.sheets.push(new SpriteSheet(f, 16, cb)); 
    },

    renderImage : function(ctx, x, y, tx, ty, tsheet){
        ctx.drawImage(this.get(tx, ty, tsheet), x, y);
    },

    //TODO: have an ordered list of all tiles accessible by #
};

function SpriteSheet(sheet, size, callback){
    this.img = new Image();
    this.img.src = utils.getSpriteDir(sheet);
    this.tiles = [];
    this.spriteW = 20;

	this.tilesWide = 0;
	this.tilesHigh = 0; 
    //CLOSING TIME
    var img = this.img; 
    var abbr = spriteAbbr[sheet]; 

    this.imgLoad = 
        function(){
            //cache some tiles (this code makes sure not to load the same tile twice)
            //
			this.tilesWide = this.img.naturalWidth/globals.tileWidth;
			this.tilesHigh = this.img.naturalHeight/globals.tileWidth;
			
            for (var i=0;i<this.img.naturalWidth/globals.tileWidth;i++){
                for (var j=0;j<this.img.naturalHeight/globals.tileWidth;j++){
                    var buff = document.createElement('canvas');
                    buff.width = globals.tileWidth;
                    buff.height = globals.tileWidth;
                    buff.getContext('2d').drawImage(this.img, i*globals.tileWidth, j*globals.tileWidth, globals.tileWidth, globals.tileWidth, 0, 0, globals.tileWidth, globals.tileWidth);


                    if (Sprites.add(buff, i, j, abbr )) { //true on new sprite
                        this.tiles.push([i,j, abbr]) ; //TODO: dehardcode
                    }
                }
            }

            callback();
        };

    var thisObj = this;
    this.img.onload = function(){
        thisObj.imgLoad();
    }
    this.renderImage = function(ctx, x, y, tx, ty, tsheet){
        ctx.drawImage(Sprites.get(tx, ty, tsheet), x, y);
    }
}

//takes an array of files.
//
//Made more complicated by the fact that SpriteSheet is a callback function deal thing.
/*
function loadFilesToSheet(files, callback){
    var obj;
    var tempObj;

    function recur(array, pos){
        if (pos >= array.length) callback(obj); 

        tempObj = new SpriteSheet( array[pos], 16, function(){
            //Copy data from tempObj to obj
            
            recur(array, pos+1);
        }); 
        pos++;

    }
    obj = new SpriteSheet( array[0], 16, function(){
                                            recur(array, 1);
    });

} */
