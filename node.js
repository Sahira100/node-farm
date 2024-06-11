const fs=require('fs');
const http=require('http');
const url=require('url');
const slugify=require('slugify');

const replaceTemplate=require('./modules/replaceTemplate');

///////////////////////////////////////////////
//WRITE AND READ FILE

//Non-blocking,Asynchronous way
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     if(err) return console.log("ERROR!");
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         if(err) return console.log("ERROR!");
//         fs.readFile(`./txt/append.txt`,'utf-8',(err,data3)=>{
//             if(err) return console.log("ERROR!");
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
//                 console.log("Your file has been written");
//             })
            
//         })
//     })
// })


//Blocking ,synchronous way
// const texIn=fs.readFileSync("./txt/input.txt",'utf-8');
// console.log(texIn);

// const textOut=`this is what we know about the avacado: ${texIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt",textOut);
// console.log("File Write Completed");


////////////////////////////////////////////
//SERVER
const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');



const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);

const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));

console.log(slugs);

const server=http.createServer((req,res)=>{

    const {query,pathname}=url.parse(req.url,true);

    if(pathname==="/"|| pathname==="/overview"){
        res.writeHead(200,{'Content-type':'text/html'});

        const cardHtml=dataObj.map(el=>replaceTemplate(tempCard,el)).join('');
        const output=tempOverview.replace(`{%PRODUCT_CARDS%}`,cardHtml);
        res.end(output);

        //Product page
    }else if(pathname==="/product"){

        res.writeHead(200,{"Content-type":"text/html"});
        const product = dataObj[query.id];
        const output=replaceTemplate(tempProduct,product);
        res.end(output);

        

        //API
    }else if(pathname==="/api"){
        res.writeHead(200,{
            "Content-type":"application/json"
        });

        res.end(data);

    }else{
        res.writeHead(404,{
            "Content-type":"text/html",
            "my-own-header":"hello world"
        });
        res.end("<h1>404 NOT FOUND</h1>");
    }

});

server.listen(8000,()=>{
    console.log("Listening to requests on port 8000");
})

