const $ = require('cheerio')
const axios = require('axios').default
const mysql = require('mysql')

const connection = mysql.createConnection({host: 'localhost', user: 'root', password:'', database: 'scraping'})

try{
    connection.connect();
}catch(e){
    console.log(e);
}


async function storeData(data) {
    return new Promise((resolve, reject) => {
        connection.query({sql: "INSERT INTO products VALUES(?, ?, ?, ?)", values: data}, (err, res, fields) => {
            if( err ){
                reject(console.log(err));
                console.log('Something went wrong');
            }

            resolve(true)
            
        })
    })
}


function requestPage(url){

    return new Promise(async (resolve, reject) => {
        try{
            let body = await axios.get(url);
            let elements = await $('product_specs', $.xml(body)).toArray()
            await elements.forEach( async (e, i) => {
                var model = $('pn', e).text()
                var brand = $('brand_name', e).text()
                var price = $('map', e).text() || 0;

                await storeData([null, model, brand, price]);

                if( i == elements.length-1 ){
                    console.log('Process Finished')
                    process.exit()
                }

                console.log('OK!', i)
            })
        }catch(e){
            console.log(e.message)
            reject(e.message)
        }

        resolve(true)

    })

}

(async function(){
    try{
        requestPage("http://api.slymanbros.slymanmedia.com/storage/XML/4936_SLYMANBROS_SITE_SPECS_COYOTE.XML");
    }catch(e){
        console.log(e.message)
        process.exit()
    }
    
})()


 

    

    