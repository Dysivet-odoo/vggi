function deg2rad(angle) {
    return angle * Math.PI / 180;
}

function Vertex(p, uv)
{
    this.triangles = [];
    this.p = p;
    this.uv = uv;
    this.normal = [];
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

const COUNT_POINTS_U = 60;
const COUNT_POINTS_V = 60;

// const U_SPACE = [0,pi];
// const V_SPACE = [0,2*pi];

const U_SPACE = [-pi,pi];
const V_SPACE = [0,2*pi];

const STEP_U = (U_SPACE[1] - U_SPACE[0]) / (COUNT_POINTS_U-1);
const STEP_V = (V_SPACE[1] - V_SPACE[0]) / (COUNT_POINTS_V-1);

// const COUNT_POINTS_U = 3;
// const COUNT_POINTS_V = 3;


function createTriangle(vertexList, triangleList, vertex, index_point_1, index_point_2){
    let count_points = vertexList.length;
    let count_triangles = triangleList.length;
    let t = new Triangle(count_points, index_point_1, index_point_2);
    vertexList[index_point_1].triangles.push(count_triangles);
    vertexList[index_point_2].triangles.push(count_triangles);
    vertex.triangles.push(count_triangles);
    triangleList.push(t);
}

function buildPointTriangle(vertexList, triangleList, vertex, u_index, isLastRow)
{
    let count_points = vertexList.length;
    if(u_index != COUNT_POINTS_U - 1){
        //  Prev Current          
        //    o   o          
        //    o   o                    
        //    2   o                    
        //    1   S                    
        index_point_1 = count_points - COUNT_POINTS_U;
        index_point_2 = count_points - COUNT_POINTS_U + 1;
        createTriangle(vertexList, triangleList, vertex, index_point_1, index_point_2);
    }

    if(u_index != 0){
        //  Prev Current
        //    o   o
        //    o   o
        //    1   S
        //    o   3
        index_point_1 = count_points - COUNT_POINTS_U;
        index_point_3 = count_points - 1;
        createTriangle(vertexList, triangleList, vertex, index_point_1, index_point_3);
    }
}

function CreateSurfaceData(polylinesU, polylinesV)
{
    let vertexList = [];
    let triangleList = [];
    console.log(polylinesU);
    console.log(polylinesV);
    for(let v_index=0; v_index<polylinesV.length; v_index++){
        for(let u_index=0; u_index<polylinesU.length; u_index++){
            let vertex = new Vertex(getVector(polylinesU[u_index], polylinesV[v_index]), [polylinesU[u_index], polylinesV[v_index]]);
            if(v_index != 0){
                buildPointTriangle(vertexList, triangleList, vertex, u_index, false);
            }
            vertexList.push(vertex);
        }
    }

    for (let i = 0; i < COUNT_POINTS_U; i++) {
        let ind = (COUNT_POINTS_V - 1) * COUNT_POINTS_U + i;
        let count_triangles = triangleList.length;
        if(i != COUNT_POINTS_U - 1){
            //  Last First     
            //    o   o                       
            //    o   o                      
            //    1   o                     
            //    S   2                     
            index_point_1 = ind + 1;
            index_point_2 = ind - (COUNT_POINTS_V - 1) * COUNT_POINTS_U;
            
            let t = new Triangle(ind, index_point_1, index_point_2);
            vertexList[index_point_1].triangles.push(count_triangles);
            vertexList[index_point_2].triangles.push(count_triangles);
            vertexList[ind].triangles.push(count_triangles);
            triangleList.push(t);
        }
    
        if(i != 0){
            //  Last First     
            //    o   o                       
            //    o   o                      
            //    S   1                     
            //    o   2   
            let count_triangles = triangleList.length;
            index_point_1 = ind - (COUNT_POINTS_V - 1) * COUNT_POINTS_U;
            index_point_2 = ind - (COUNT_POINTS_V - 1) * COUNT_POINTS_U - 1;
            
            let t = new Triangle(ind, index_point_1, index_point_2);
            vertexList[index_point_1].triangles.push(count_triangles);
            vertexList[index_point_2].triangles.push(count_triangles);
            vertexList[ind].triangles.push(count_triangles);
            triangleList.push(t);
        }
    }

    for (let i = 0; i < COUNT_POINTS_V; i++) {
        let ind = i * COUNT_POINTS_U;
        let count_triangles = triangleList.length;
        //  Prev Current     
        //    o   1                       
        //    o   o                      
        //    o   o                     
        //    2   S   
        index_point_1 = ind + COUNT_POINTS_U - 1;
        index_point_2 = i==0 ? COUNT_POINTS_U * COUNT_POINTS_V - 1 : ind - 1 ;
        
        let t = new Triangle(ind, index_point_1, index_point_2);
        vertexList[index_point_1].triangles.push(count_triangles);
        vertexList[index_point_2].triangles.push(count_triangles);
        vertexList[ind].triangles.push(count_triangles);
        triangleList.push(t);

        //  Prev Current Next  
        //    o   1       o            
        //    o   o       o             
        //    o   o       o           
        //    o   S       3
        index_point_3 = i==COUNT_POINTS_V-1 ? 0 : ind + COUNT_POINTS_U;
        count_triangles++;
        let t1 = new Triangle(ind, index_point_1, index_point_3);
        vertexList[index_point_1].triangles.push(count_triangles);
        vertexList[index_point_3].triangles.push(count_triangles);
        vertexList[ind].triangles.push(count_triangles);
        triangleList.push(t1);
        
    }


    // let vertexList_test = [];
    // let triangleList_test = [];
    // for(let v_index=0; v_index<3; v_index++){
    //     for(let u_index=0; u_index<3; u_index++){
    //         let vertex = new Vertex([0,0,0]);
    //         if(v_index != 0) { // First line skipping (cannot build triangles for first line)
    //             buildPointTriangle(vertexList_test, triangleList_test, vertex, u_index, false);
    //         }
    //         if(v_index == polylinesV.length - 1) { // Connect last line with fisrt line
    //             buildPointTriangle(vertexList_test, triangleList_test, vertex, u_index, true);
    //         }
    //         vertexList_test.push(vertex);
    //     }
    // }
    // console.log(vertexList_test);
    // console.log(triangleList_test);

    calculateNormals(vertexList, triangleList);

    console.log(vertexList);
    console.log(triangleList);

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

    vertexNormalsF32 = new Float32Array(vertexList.length*3);
    for (let i=0; i<vertexList.length; i++)
    {
        vertexNormalsF32[i*3 + 0] = vertexList[i].normal[0];
        vertexNormalsF32[i*3 + 1] = vertexList[i].normal[1];
        vertexNormalsF32[i*3 + 2] = vertexList[i].normal[2];
    }


    return {verticesF32, indicesU16, vertexNormalsF32};
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

    // let vec_x = 3.0 * Math.sin(u) * Math.cos(v);
    // let vec_y = 3.0 * Math.sin(u) * Math.sin(v);
    // let vec_z = 3.0 * Math.cos(u);
    return [scale * vec_x, scale * vec_y, scale * vec_z]
}

// function calculateNormals(vertexList, triangleList){
//     // for (let i=0; i<triangleList.length; i++){
//     //     let t = triangleList[i];
//     //     let p0 = vertexList[t.v0].p;
//     //     let p1 = vertexList[t.v1].p;
//     //     let p2 = vertexList[t.v2].p;
        
//     //     let v1 = m4.subtractVectors(p1, p0);
//     //     let v2 = m4.subtractVectors(p2, p0);
//     //     triangleList[i].normal = m4.normalize(m4.cross(v1, v2));
//     // }

//     // // vertex normal facet average
//     // for (let i=0; i<vertexList.length; i++){
//     //     let normal = [0,0,0];
//     //     for(const t of vertexList[i].triangles){
//     //         normal = m4.addVectors(normal, triangleList[t].normal);
//     //     }
//     //     vertexList[i].normal = [normal[0]/6.0, normal[1]/6.0, normal[2]/6.0];
//     // }

//     for (let i=0; i<vertexList.length; i++){
//         let normal = [0,0,0];
//         for(const index_triangle of vertexList[i].triangles){ 
//             let p1,p2;
//             let t = triangleList[index_triangle];
//             if(t.v0 == i){
//                 p1 = t.v1;
//                 p2 = t.v2;
//             } else if(t.v1 == i){
//                 p1 = t.v0;
//                 p2 = t.v2;
//             } else if(t.v2 == i){
//                 p1 = t.v0;
//                 p2 = t.v1;
//             }
//             let v1 = m4.subtractVectors(vertexList[p1].p, vertexList[i].p);
//             let v2 = m4.subtractVectors(vertexList[p2].p, vertexList[i].p);
//             normal = m4.addVectors(normal, m4.normalize(m4.cross(v1, v2)));
//         }
//         vertexList[i].normal = [normal[0]/6.0, normal[1]/6.0, normal[2]/6.0];
//     }
// }

function calculateNormals(vertexList, triangleList){
    for (let i=0; i<vertexList.length; i++){
        let vertex = vertexList[i];
        let p0 = vertex.p;
        let p1 = getVector(vertex.uv[0] + STEP_U, vertex.uv[1]);
        let p2 = getVector(vertex.uv[0], vertex.uv[1] + STEP_V);
        let p3 = getVector(vertex.uv[0] - STEP_U, vertex.uv[1] + STEP_V);
        let p4 = getVector(vertex.uv[0] - STEP_U, vertex.uv[1]);
        let p5 = getVector(vertex.uv[0] - STEP_U, vertex.uv[1] - STEP_V);
        let p6 = getVector(vertex.uv[0], vertex.uv[1] - STEP_V);
        
        let v1 = m4.subtractVectors(p1, p0);
        let v2 = m4.subtractVectors(p2, p0);
        let v3 = m4.subtractVectors(p3, p0);
        let v4 = m4.subtractVectors(p4, p0);
        let v5 = m4.subtractVectors(p5, p0);
        let v6 = m4.subtractVectors(p6, p0);
        
        let n1 = m4.normalize(m4.cross(v1, v2));
        let n2 = m4.normalize(m4.cross(v2, v3));
        let n3 = m4.normalize(m4.cross(v3, v4));
        let n4 = m4.normalize(m4.cross(v4, v5));
        let n5 = m4.normalize(m4.cross(v5, v6));
        let n6 = m4.normalize(m4.cross(v6, v1));
        let n = [
            (n1[0] + n2[0] + n3[0] + n4[0] + n5[0] + n6[0]) / 6.0,
            (n1[1] + n2[1] + n3[1] + n4[1] + n5[1] + n6[1]) / 6.0,
            (n1[2] + n2[2] + n3[2] + n4[2] + n5[2] + n6[2]) / 6.0
        ];
        vertexList[i].normal = n;
    }

    // vertex normal facet average
    // for (let i=0; i<vertexList.length; i++){
    //     let normal = [0,0,0];
    //     for(const t of vertexList[i].triangles){
    //         normal = m4.addVectors(normal, triangleList[t].normal);
    //     }
    //     vertexList[i].normal = normal;
    // }
}

function getPolylines(min, count, step){
    let list = [];
    for(let i=0; i<count; i++){
        list.push(min + i * step);
    }
    return list;
}

// Constructor
function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();
    this.iVertexNormalBuffer = gl.createBuffer();
    this.count = 0;

    this.u_polylines = getPolylines(U_SPACE[0], COUNT_POINTS_U, STEP_U);
    this.v_polylines = getPolylines(V_SPACE[0], COUNT_POINTS_V, STEP_V);

    this.BufferData = function() {
        let data = CreateSurfaceData(this.u_polylines, this.v_polylines);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.verticesF32, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indicesU16, gl.STREAM_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.vertexNormalsF32, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iVertexNormal, 3, gl.FLOAT, true, 0, 0);
        gl.enableVertexAttribArray(shProgram.iVertexNormal);

        this.count = indicesU16.length;
    }

    this.Draw = function() {

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }

}