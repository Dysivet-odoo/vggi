function deg2rad(angle) {
    return angle * Math.PI / 180;
}

function Vertex(p)
{
    this.p = p;
    this.normal = [];
    this.triangles = [];
}

function Triangle(v0, v1, v2)
{
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.normal = [];
    this.tangent = [];
}

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

const COUNT_POINTS = 70;


function buildPointTriangle(vertexList, triangleList, vertex, u_index, isLastRow)
{
    let count_points = vertexList.length;
    let count_triangles = triangleList.length;
    if (isLastRow){
        index_point_1 = count_points - COUNT_POINTS * (COUNT_POINTS - 1);
        index_point_2 = count_points - COUNT_POINTS * (COUNT_POINTS - 1) + 1;
    } else {
        index_point_1 = count_points - COUNT_POINTS;
        index_point_2 = count_points - COUNT_POINTS + 1;
    }
    let t = new Triangle(count_points, index_point_1, index_point_2);
    vertexList[index_point_1].triangles.push(count_triangles);
    vertexList[index_point_2].triangles.push(count_triangles);
    vertex.triangles.push(count_triangles);
    triangleList.push(t);
    if (u_index != 0){
        index_point_3 = count_points - 1;
        let t1 = new Triangle(count_points, index_point_1, index_point_3);
        vertexList[index_point_1].triangles.push(count_triangles+1);
        vertexList[index_point_3].triangles.push(count_triangles+1);
        vertex.triangles.push(count_triangles+1);
        triangleList.push(t1);
    }
}


function CreateSurfaceData(polylinesU, polylinesV)
{
    let vertexList = [];
    let triangleList = [];
    for(let v_index=0; v_index<polylinesV.length; v_index++){
        for(let u_index=0; u_index<polylinesU.length; u_index++){
            let vertex = new Vertex(getVector(polylinesU[u_index], polylinesV[v_index]));
            if(v_index != 0) {
                buildPointTriangle(vertexList, triangleList, vertex, u_index, false);
            }
            if(v_index == polylinesV.length - 1) {
                buildPointTriangle(vertexList, triangleList, vertex, u_index, true);
            }
            vertexList.push(vertex);
        }
    }

    verticesF32 = new Float32Array(vertexList.length*3);
    for (let i=0; i<vertexList.length; i++)
    {
        verticesF32[i*3 + 0] = vertexList[i].p[0];
        verticesF32[i*3 + 1] = vertexList[i].p[1];
        verticesF32[i*3 + 2] = vertexList[i].p[2];
    }

    indicesU16 = new Uint16Array(triangleList.length*3);
    for (let i=0; i<triangleList.length; i++)
    {
        indicesU16[i*3 + 0] = triangleList[i].v0;
        indicesU16[i*3 + 1] = triangleList[i].v1;
        indicesU16[i*3 + 2] = triangleList[i].v2;
    }


    return {verticesF32, indicesU16};
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


function getPolylines(min, max){
    let step = (max - min) / COUNT_POINTS;
    let list = [];
    for(let i=0; i<=COUNT_POINTS; i++){
        list.push(min + i * step);
    }
    return list;
}

// Constructor
function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();
    this.count = 0;
    this.u_polylines = getPolylines(-pi, pi);
    this.v_polylines = getPolylines(0, 2*pi);

    this.BufferData = function() {
        let data = CreateSurfaceData(this.u_polylines, this.v_polylines);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.verticesF32, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indicesU16, gl.STREAM_DRAW);

        // gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0); вектори нормалі повинні з true

        //      C
        // A        B

        // (C - A) x (B - A)

        this.count = indicesU16.length;
    }

    this.Draw = function() {

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }

}