const scale = 0.6;
const pi = Math.PI;

const a = 1;
const teta = 0;
const r = 2;

// const a = 1;
// const teta = 0;
// const r = 1;

// const a = 1;
// const teta = 0.25 * pi;
// const r = 2;

const COUNT_POINTS = 60;
const step_u = 2 * pi / COUNT_POINTS;
const step_v = 2 * pi / COUNT_POINTS;

function CreateSurfaceData(u_polylines, v_polylines)
{
    let vertexListU = [];
    for(const u of u_polylines){
        for(const v of v_polylines){
            let vertex = getVector(u, v);
            vertexListU.push(...vertex);
        }
    }

    let vertexListV = [];
    for(const v of v_polylines){
        for(const u of u_polylines){
            let vertex = getVector(u, v);
            vertexListV.push(...vertex);
        }
    }

    return {vertexListU, vertexListV};
}

function x(u){
    return a * Math.pow(Math.cos(u),3);
}

function z(u){
    return a * Math.pow(Math.sin(u),3);
}

function getVector(u, v){
    let vec_x = (r + x(u) * Math.cos(teta) - z(u) * Math.sin(teta)) * Math.cos(v);
    let vec_y = (r + x(u) * Math.cos(teta) - z(u) * Math.sin(teta)) * Math.sin(v);
    let vec_z = x(u) * Math.sin(teta) + z(u) * Math.cos(teta);
    return [scale * vec_x, scale * vec_y, scale * vec_z]
}


function getPolylines(min, max, step){
    let list = [];
    for(let i=min; i<=max; i+=step){
        list.push(i);
    }
    return list;
}

// Constructor
function Model(name) {
    this.name = name;
    this.iVertexBufferU = gl.createBuffer();
    this.iVertexBufferV = gl.createBuffer();
    this.count = 0;
    this.u_polylines = getPolylines(-pi, pi, step_u);
    this.v_polylines = getPolylines(0, 2*pi, step_v);

    this.BufferData = function() {
        let vertices = CreateSurfaceData(this.u_polylines, this.v_polylines);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBufferU);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.vertexListU), gl.STREAM_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBufferV);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.vertexListV), gl.STREAM_DRAW);

        this.count = vertices.vertexListU.length/3;
        
    }

    this.Draw = function() {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBufferU);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
        
        gl.drawArrays(gl.LINE_STRIP, 0, this.count);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBufferV);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
   
        gl.drawArrays(gl.LINE_STRIP, 0, this.count);
    }
}