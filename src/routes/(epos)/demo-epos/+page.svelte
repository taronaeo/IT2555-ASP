<!--PAGE IS TO BE DISPLAYED IN 1180 x 820 RESOLUTION-->

<script lang="ts">
    import { getHttpsEndpoint } from '$lib/firebase/functions';
    
    let editing:boolean = false;
    let selected:boolean = false;
    let payment:boolean = false;
    let paynow:boolean = false;
    let edit_quantity_value:number = 1;
    let editing_item_name:string = "";
    let quantity_of_item:number = 0;
    let ordered_items:{item:string; quantity:number}[] = [];
    let payment_method: string = "";


    let subtotal_float:number  = 0;
    let subtotal_str:string = "";

    let gst_float:number = 0;
    let gst_str:string = "";
    
    let total_float:number = 0;
    let total_str:string = "";
    
    let imgSrcBase64 ="";

    let generatedReceipt = ""

    const branch_info: {branchId: string; vendorId: string; key: string; secret: string;}={
        branchId: '',
        vendorId: '',
        key: '',
        secret: ''

    }

    const food: {itemName: string; price: number}[] = [
        {"itemName": "Aglio Olio", "price": 16.50},
        {"itemName":"Carbonara", "price":18.50},
        {"itemName": "Ribeye 300g","price":30.00},
        {"itemName": "Ribeye 250g","price":25.30},
        {"itemName": "Sirloin 300g","price":25.50},
        {"itemName": "Rump 300g","price": 19.80},
        {"itemName": "Rump 400g","price": 16.50},
        {"itemName": "Margherita","price": 25.00},
        {"itemName": "Pepperoni","price": 28.00},
        {"itemName": "Salmon Fillet","price":16.40},
        {"itemName": "Chicken Chop","price": 18.20},
        {"itemName": "Lamb Chop","price":22.50},
        {"itemName": "Pork Chop","price":22.50},
        {"itemName": "Chicken Gizzard","price":28.30},
        {"itemName": "Beef Tongue","price": 15.30},
        {"itemName": "Cheese Burger","price": 16.30},
        {"itemName": "Ham Burger","price": 13.50},
        {"itemName": "Lamb Burger","price": 18.40},
        {"itemName": "Pork Burger","price": 16.50},
        {"itemName": "Chicken Burger","price": 13.50},
        {"itemName": "Mushroom Soup","price": 8.50},
        {"itemName": "Cream of Corn","price":6.50},
        {"itemName": "Chicken Soup","price":5.00},
        {"itemName": "French Fries","price":4.50},
        {"itemName": "Baked Potato","price":8.30},
        {"itemName": "Caesar Salad","price":5.00},
        {"itemName": "Coleslaw","price":6.00}
]

    $:{ subtotal_float = 0;
        ordered_items.forEach(item=>{
            
            quantity_of_item+=1
            let item_name: string = item["item"]
            let item_price: number = 0;
            food.forEach(food_item =>{
                if(food_item['itemName'] === item_name){
                    item_price = food_item['price']
                }
            })
            
            quantity_of_item = item["quantity"]
            subtotal_float += (item_price * quantity_of_item)
            subtotal_float = Math.round(subtotal_float * 100) / 100
            gst_float = subtotal_float*100*0.08
            gst_float = (gst_float / 100)
            total_float = gst_float + subtotal_float

        })
        subtotal_str = '$' + subtotal_float.toFixed(2)
        gst_str = '$' + gst_float.toFixed(2)
        total_str = '$' + total_float.toFixed(2)
    }

    async function generateQR(receiptId:string){
        qrExpired=false
        const imgSrc = await fetch(`/api/qr-generation?receiptId=${receiptId}`,{
            method: "GET",
        });
        imgSrcBase64 = await imgSrc.text();
        setTimeout(() => {
            qrExpired = true;
        }, 60000)

    }

    async function createHmac(receipt: string, apiSecret: string) {
        let encoder = new TextEncoder();
        let encodedApiSecret = encoder.encode(apiSecret);

        let key = await window.crypto.subtle.importKey(
            "raw",
            encodedApiSecret,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        let encodedReceipt = encoder.encode(receipt);
        let signature = await window.crypto.subtle.sign("HMAC", key, encodedReceipt);

        let signatureArray = new Uint8Array(signature);
        let signatureHex = Array.from(signatureArray)
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
        return signatureHex;
    }

    async function callAPI(){
        
        const branchId: string = branch_info['branchId']
        const vendorId: string = branch_info['vendorId']
        const key: string = branch_info['key']
        const secret: string = branch_info['secret']
        

        const currentDate = new Date();
        const nonce: string = `${currentDate.getTime()}`;

        let final_items = []
        ordered_items.forEach(item =>{
            let item_price: number = 0;

            food.forEach(food_item =>{
                if(food_item['itemName'] === item['item']){
                    item_price = food_item['price']
                }
            })

          let receipt_item:{itemName: string; price: string} = {
            'itemName': item['item'],
            'price': item_price.toFixed(2)
          }
          for(let i = 0; i < item['quantity'];i++){
           final_items.push(receipt_item)
          }

        })

        
        let receipt: {vendorId: string; branchLocation: string; branchId: string; branchPostal: string; items:{itemName:string;price:string;}; subtotal: string; gst: string; total: string; paymentMethod: string; change: string} = {
            vendorId: vendorId,
            branchId: branchId,
            items: final_items,
            subtotal: subtotal_float.toFixed(2),
            gst: gst_float.toFixed(2),
            total: total_float.toFixed(2),
            paymentMethod: payment_method,
            change: changeNumber.toFixed(2),
            
        }   
        const receiptString: string =  JSON.stringify(receipt);
        const hmacHex = await createHmac(receiptString, secret);
        
        const endpoint = getHttpsEndpoint('onHttpReceiptSubmit');
        await fetch(endpoint,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "API-Key": key,
                "API-Secret": secret,
                "Nonce": nonce,
                "HMAC": hmacHex,
            },
            body: receiptString
        }).then(res => {
            return res.json();
        })
          .then(data =>{
            if(data.status != 200){
                throw Error(`API Endpoint returned ${data.status}, with ${data.message}`)
            }   
            generateQR(data.message);
            generatedReceipt = data.message;
          }).catch(err => {
            validQR = false;
            console.error(err);
          })
    }
    let paymentSuccess = false;
    let cashPaymentSuccess = false;
    let validQR = true;
    let cash = false;
    let creditPaymentSuccess = false;
    
    let cashAmount = 0;
    let change = 0;
    
    let changeFixed: string = '';
    let changeNumber:number = 0

    function calculateChange(cash){
        if (cash<total_float){
            change = 0;
            return
        }
        change = cash - total_float
        changeFixed = change.toFixed(2)
        changeNumber = Number(changeFixed)
    }
    
    function validateCash(){
        if(cashAmount<total_float){
            return
        }
        cashPaymentSuccess = true;
        callAPI();
        
    }

    let qrExpired = false;
    
    function regenQR(receiptId){
        generateQR(receiptId)
    }

</script>


<div class="bg-blue-700 fixed w-full h-8 text-white flex items-center font-light">
<div class="flex-1 ml-2">
ePOS v34.2.3 
</div>
<div class="flex-1 text-end mr-2">
    Cashier: Spiderman
</div>
</div>

<div class:hidden={!selected} class="fixed inset-0 w-full bg-black/50">
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-300 py-12 px-32 border-2 border-t-black border-l-black border-b-white border-r-white text-xl">
        Edit Quantity for Item: <span class="font-bold">{editing_item_name}</span>
        <input bind:value={edit_quantity_value} readonly class="text-center m-auto block mt-6 bg-zinc-100 border-zinc-400 border-2">
        
        <div class="text-center mt-6">
            <div on:click={()=>{if(edit_quantity_value >=0){edit_quantity_value++}}} class="w-14 h-14 mx-2 bg-red-700 text-white text-6xl font-bold rounded-lg inline-block items-center justify-center break-all ">+</div>
            <div on:click={()=>{if(edit_quantity_value >0){edit_quantity_value--}}} class="w-14 h-14 mx-2 bg-red-700 text-white text-6xl font-bold rounded-lg inline-block items-center justify-center break-all ">-</div>
            <div on:click={()=>{for(let i=0; i < ordered_items.length;i++){
                if(editing_item_name===ordered_items[i]["item"]){
                    ordered_items[i]["quantity"] = edit_quantity_value
                    if(edit_quantity_value===0){
                        ordered_items.splice(i,1)
                        ordered_items=ordered_items
                    }   
                }
            }}}
            on:click={()=>selected=false}
            on:click={()=>edit_quantity_value=1}
            class="w-14 h-14 mx-2 bg-blue-600 text-white text-6xl font-bold rounded-lg inline-block items-center justify-center break-all ">&#9166;</div>
        </div>

    </div>
</div>
<div class:hidden={!paynow} class="fixed flex justify-center items-center inset-0 w-full bg-black/50">
    <div class:hidden={paymentSuccess} class="text-center font-bold bg-zinc-300 py-12 px-32 border-2 border-t-black border-l-black border-b-white border-r-white text-xl">
        Scan QR Code for payment
        <div>
        <img on:click={()=>{paymentSuccess=true;}} on:click={callAPI}  src="example-qr.png" class="mt-4 text-center h-72"> <!--on:click={callAPI}-->
        </div>
        <button on:click = {()=>{paynow=false}} class=" w-32 mt-2 flex justify-center m-auto font-bold border-b-2 border-2 border-zinc-600 border-l-white border-t-white bg-red-700 rounded px-8 py-3 text-2xl text-zinc-100">
            Cancel
        </button>
    </div>
    <div class:hidden={!paymentSuccess} class="text-center font-bold w-4/5 bg-zinc-300 py-12 px-32 border-2 border-t-black border-l-black border-b-white border-r-white text-xl">
        {#if validQR && !qrExpired}
        <div class="font-bold">
            Payment Successful! Scan QR Code for Dr Receipts
            <img class="inline text-center h-72 my-6" src="data:image/png;base64, {imgSrcBase64}"><br>
            You have 1 minute to scan the QR code before it becomes invalid.
        </div>
            {:else if !validQR}
            <div class="font-bold">ERROR OCCURRED</div>
            <div class="font-bold">RECEIPT COULD NOT BE GENERATED</div>
        {/if}
        {#if qrExpired}
        <div class="font-bold m-auto flex justify-center">Time to scan ran out, request staff for assistance</div>
        <div class="block text-center">
            <button on:click = {()=>{regenQR(generatedReceipt)}} class=" w-48 mt-2 mr-1 m-auto font-bold border-b-2 border-2 border-zinc-600 border-l-white border-t-white bg-blue-600 rounded px-8 py-3 text-2xl text-zinc-100">
                Regenerate QR
            </button>
        </div>
        {/if}   
    </div>
</div>

<div class:hidden={!cash} class="fixed flex justify-center items-center inset-0 w-full bg-black/50">
    <div class:hidden={cashPaymentSuccess} class="text-center font-bold bg-zinc-300 py-12 px-32 border-2 border-t-black order-l-black border-b-white border-r-white text-xl">
        <div>Enter Cash Amount</div><br>
        <div class="font-normal">Change: <input readonly bind:value={changeFixed} class="bg-zinc-300"></div>
        <input bind:value={cashAmount} on:input={()=>calculateChange(cashAmount)} class="text-center m-auto block mt-6 bg-zinc-100 border-zinc-400 border-2">
        <div class="flex flex-row my-2">
        <button on:click = {()=>{validateCash()}} class=" w-32 mt-2 mr-1 flex justify-center m-auto font-bold border-b-2 border-2 border-zinc-600 border-l-white border-t-white bg-blue-600 rounded px-8 py-3 text-2xl text-zinc-100">
            Confirm
        </button>
        <button on:click = {()=>{cash=false}} class=" w-32 mt-2 ml-1 flex justify-center m-auto font-bold border-b-2 border-2 border-zinc-600 border-l-white border-t-white bg-red-700 rounded px-8 py-3 text-2xl text-zinc-100">
            Cancel
        </button>
        </div>
    </div>
    <div class:hidden={!cashPaymentSuccess} class="text-center font-bold w-4/5 bg-zinc-300 py-12 px-32 border-2 border-t-black border-l-black border-b-white border-r-white text-xl">
        {#if validQR && !qrExpired}
        <div class="font-bold">
            Payment Successful! Scan QR Code for Dr Receipts
            <img class="inline text-center h-72 my-6" src="data:image/png;base64, {imgSrcBase64}"><br>
            You have 1 minute to scan the QR code before it becomes invalid.
        </div>
            {:else if !validQR}
            <div class="font-bold">ERROR OCCURRED</div>
            <div class="font-bold">RECEIPT COULD NOT BE GENERATED</div>
        {/if}  
        {#if qrExpired}
        <div class="font-bold m-auto flex justify-center">Time to scan ran out, request staff for assistance</div>
        <div class="block text-center">
            <button on:click = {()=>{regenQR(generatedReceipt)}} class=" w-48 mt-2 mr-1 m-auto font-bold border-b-2 border-2 border-zinc-600 border-l-white border-t-white bg-blue-600 rounded px-8 py-3 text-2xl text-zinc-100">
                Regenerate QR
            </button>
        </div>
        {/if}   
    </div>


</div>

<div class:hidden={!creditPaymentSuccess} class="fixed flex justify-center items-center inset-0 w-full bg-black/50">
    <div  class="text-center font-bold w-4/5 bg-zinc-300 py-12 px-32 border-2 border-t-black border-l-black border-b-white border-r-white text-xl">
        {#if validQR && !qrExpired}
        <div class="font-bold">
            Payment Successful! Scan QR Code for Dr Receipts
            <img class="inline text-center h-72 my-6" src="data:image/png;base64, {imgSrcBase64}"><br>
            You have 1 minute to scan the QR code before it becomes invalid.
        </div>
            {:else if !validQR}
            <div class="font-bold">ERROR OCCURRED</div>
            <div class="font-bold">RECEIPT COULD NOT BE GENERATED</div>
        {/if}  
        {#if qrExpired}
        <div class="font-bold m-auto flex justify-center">Time to scan ran out, request staff for assistance</div>
        <div class="block text-center">
            <button on:click = {()=>{regenQR(generatedReceipt)}} class=" w-48 mt-2 mr-1 m-auto font-bold border-b-2 border-2 border-zinc-600 border-l-white border-t-white bg-blue-600 rounded px-8 py-3 text-2xl text-zinc-100">
                Regenerate QR
            </button>
        </div>
        {/if}   
    </div>

    
</div>

<div class="p-4 h-screen pt-12 bg-zinc-400 grid grid-cols-5 gap-x-2">
    
    <div class="col-span-3">
            <div class="flex border-2 border-white mb-4 pt-2 pl-1  ">
                <div class="-mt-2 flex flex-col">
                        <img src="user-icon.svg" alt="icon logo" class="w-14" >
                    <div class=" text-lg text-zinc-100 font-bold">  
                        Logout
                    </div>
                </div>
                <div class=" ml-2 flex flex-col">
                    <div class="flex flex-row mb-2">
                        <div class="mx-1 bg-zinc-300 w-[6.5rem] text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                            00:00
                        </div>
                        <div class="mx-1 bg-zinc-300 w-72 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                            Spiderman
                        </div>

                        <div class="mx-1 bg-zinc-300 w-48 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                            7/7/2023
                        </div>
                        
                    </div>

                    <div class="flex flex-row">
                        <div class="mx-1 bg-zinc-300 w-36 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                            Active
                        </div>
                        <div class="mx-1 bg-zinc-300 w-36 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                            ePOS 727
                        </div>
                        <div class="mx-1 bg-zinc-300 w-36 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                            Manager
                        </div>
                        <div class="mx-1 bg-zinc-300 w-36 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                            Order #4839482
                        </div>
                    </div>
                </div>
            </div>
        



        <div class="text-center gap-x-3 grid grid-cols-10 gap-y-3 mb-3">
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">0</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">1</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">2</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">3</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">4</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">5</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">6</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">7</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">8</div>
            <div class="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-5xl font-bold">9</div>
        </div>
        <div class="grid grid-cols-2 gap-y-3 gap-x-3">
            <div on:click={() => {cash=true}} on:click={()=>{payment_method = "Cash"}} class:hidden={!payment} class="flex items-center justify-center flex-col font-bold text-3xl bg-zinc-300 h-40 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                <div><img src = "cash.svg" class="h-16"></div>
                <div>Cash</div>
                
            </div>
            <div  on:click={()=>{payment_method = "Credit Card"}} on:click={()=>{callAPI();creditPaymentSuccess=true;}} class:hidden={!payment} class="flex items-center justify-center flex-col font-bold text-3xl bg-zinc-300 h-40 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                <div class="-m-4"><img src = "visa.svg" class="h-24 inline"> <img src ="mastercard.svg" class="h-12 inline "></div>
                <div>Credit Card</div>
            </div>
            <div on:click={() => paynow=true} on:click={()=>{payment_method = "Paynow"}} class:hidden={!payment} class="flex items-center justify-center flex-col font-bold text-3xl bg-zinc-300 h-40 text-center border-2 border-t-zinc-600 border-l-zinc-600 border-r-white border-b-white">
                <div class="-m-4"><img src = "paynow-logo.svg" class="h-32 inline"></div>
                <div>Paynow</div>
            </div>

        </div>
        <div class:hidden={payment} class="text-center gap-x-3 grid grid-cols-10 gap-y-3">
            <div class="w-14 h-14 bg-zinc-600 text-white text-lg rounded-lg flex items-center justify-center ">Pasta</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Aglio Olio","quantity":1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Aglio Olio","quantity":1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Aglio<br>Olio</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Carbonara","quantity":1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Carbonara","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Carbonara</div>
            <div class="w-14 h-14 font-bold rounded-lg flex items-center justify-center "></div>
            <div class="w-14 h-14 font-bold rounded-lg flex items-center justify-center "></div>
            <div class="w-14 h-14 font-bold rounded-lg flex items-center justify-center "></div>
            <div class="w-14 h-14 font-bold rounded-lg flex items-center justify-center "></div>
            <div class="w-14 h-14 font-bold rounded-lg flex items-center justify-center "></div>
            <div class="w-14 h-14 font-bold rounded-lg flex items-center justify-center "></div>
            <div class="w-14 h-14 font-bold rounded-lg flex items-center justify-center "></div>

            <div class="w-14 h-14 bg-zinc-600 text-white text-lg rounded-lg flex items-center justify-center ">Steak</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Ribeye 300g","quantity"   :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Ribeye 300g","quantity" :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Ribeye 300g</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Ribeye 250g","quantity"   :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Ribeye 250g","quantity" :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Ribeye 250g</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Sirloin 300g","quantity"  :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Sirloin 300g","quantity"    :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Sirloin<br>300g</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Rump 300g","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Rump 300g","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Rump<br>300g</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Rump 400g","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Rump 400g","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Rump<br>400g</div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>

            <div class="w-14 h-14 bg-zinc-600 text-white text-lg rounded-lg flex items-center justify-center ">Pizza</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Margherita","quantity"    :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Margherita","quantity"  :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Margherita</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Pepperoni","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Pepperoni","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Pepperoni</div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all"></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all"></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>

            <div class="w-14 h-14 bg-zinc-600 text-white text-lg rounded-lg flex items-center justify-center ">Meats</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Salmon Fillet","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Salmon Fillet","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Salmon<br>Fillet</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Chicken Chop","quantity"  :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Chicken Chop","quantity"    :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Chicken<br>Chop</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Lamb Chop","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Lamb Chop","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Lamb<br>Chop</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Pork Chop","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Pork Chop","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Pork<br>Chop</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Chicken Gizzard","quantity"   :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Chicken Gizzard","quantity" :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Chicken<br>Gizzard</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Beef Tongue","quantity"   :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Beef Tongue","quantity" :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Beef<br>Tongue</div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            
            <div class="w-14 h-14 bg-zinc-600 text-white text-lg rounded-lg flex items-center justify-center ">Burger</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Cheese Burger","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Cheese Burger","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Cheese<br>Burger</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Ham Burger","quantity"    :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Ham Burger","quantity"  :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Ham<br>Burger</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Lamb Burger","quantity"   :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Lamb Burger","quantity" :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Lamb<br>Burger</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Pork Burger","quantity"   :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Pork Burger","quantity" :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Pork<br>Burger</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Chicken Burger","quantity"    :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Chicken Burger","quantity"  :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Chicken<br>Burger</div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>

            <div class="w-14 h-14 bg-zinc-600 text-white text-lg rounded-lg flex items-center justify-center ">Soup</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Mushroom Soup","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Mushroom Soup","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Mushroom</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Cream of Corn","quantity" :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Cream of Corn","quantity"   :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Cream of Corn</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Chicken Soup","quantity"  :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Chicken Soup","quantity"    :1})
                ordered_items = ordered_items
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Chicken</div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all"></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>

            <div class="w-14 h-14 bg-zinc-600 text-white text-lg rounded-lg flex items-center justify-center ">Sides</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"French Fries","quantity"  :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"French Fries","quantity" :1})
                ordered_items = ordered_items
            
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">French<br>Fries</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Baked Potato","quantity"  :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Baked Potato","quantity"    :1})
                ordered_items = ordered_items
            
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all ">Baked<br>Potato</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Caesar Salad","quantity"  :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Caesar Salad","quantity"    :1})
                ordered_items = ordered_items
            
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Caesar<br>Salad</div>
            <div on:click={()=>{
                let item_count = 0;
                ordered_items.forEach(item=>{
                    if(JSON.stringify(item)===JSON.stringify({"item":"Coleslaw","quantity"  :1})){
                        item_count+=1
                    }
                })
                if(item_count>0){return}
                ordered_items.push({"item":"Coleslaw","quantity"    :1})
                ordered_items = ordered_items
            
            }} 
            class="w-14 h-14 bg-blue-500 text-sm font-bold rounded-lg flex items-center justify-center break-all">Cole<br>slaw</div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>
            <div class="w-14 h-14 text-sm font-bold rounded-lg flex items-center justify-center break-all "></div>

            <hr class="border-[1px] border-white col-span-10">



            <div on:click={()=>editing = true} class="w-14 h-14 bg-red-700 text-white text-sm font-bold rounded-lg flex items-center justify-center break-all ">Edit<br>Qty.</div>
            <div on:click={()=>{editing = false;selected=false}} class="w-14 h-14 bg-red-700 text-white text-sm font-bold rounded-lg flex items-center justify-center break-all ">Cancel<br>Editing</div>
            <div on:click={()=>{ordered_items = [];subtotal_float = gst_float = total_float = 0}} class="w-14 h-14 bg-red-700 text-white text-sm font-bold rounded-lg flex items-center justify-center break-all ">Clear<br>Items</div>
        </div>

        

    </div>

    <div class="col-span-2">
        <div class="grid grid-cols-10 gap-x-1">
            <div class="text-center col-span-2  bg-zinc-300 border-2 border-b-zinc-600 border-r-zinc-600 border-t-white border-l-white">
                Qty.
            </div>

            <div class="text-center col-span-5  bg-zinc-300 border-2 border-b-zinc-600 border-r-zinc-600 border-t-white border-l-white">
                Item
            </div>

            <div class="text-center col-span-3  bg-zinc-300 border-2 border-b-zinc-600 border-r-zinc-600 border-t-white border-l-white">
                Price
            </div>
        </div>
        
        <div  class="min-h-[460px] max-h-[460px] mt-1 overflow-scroll border-2 border-b-zinc-600 border-r-zinc-600 border-t-white border-l-white" class:bg-zinc-300={!editing} class:bg-white={editing}>
            {#each ordered_items as item}

            <div on:click={
                    ()=>{if(editing){
                            selected = true;
                            editing_item_name=item["item"]
                        }
                    }
                }
                class="grid grid-cols-[2fr_5fr_3fr] mb-2">
                <div class="text-center font-bold text-xl">{item["quantity"]}</div>
                <div class="pl-8 font-bold text-xl">{item["item"]}</div>
                {#each food as food_item}
                {#if food_item["itemName"] == item["item"] }
                <div class="text-center font-bold text-xl">{food_item["price"].toFixed(2)}</div>
                {/if}
                {/each}
            </div>
            {/each}



            

            


        </div>

        
        <div class="min-h-[180px] flex py-1 px-4 mt-1 overflow-scroll bg-white border-2 border-b-zinc-600 border-r-zinc-600 border-t-white border-l-white">
            <div class="w-full items-center grid grid-cols-2 grid-rows-3">
                <div class="text-2xl font-bold">Subtotal</div>
                <input readonly class="text-end mr-10 outline-none" bind:value={subtotal_str}>

                <div class="text-2xl font-bold  my-2 ">GST</div>
                <input readonly class="text-end mr-10 outline-none" bind:value={gst_str}>

                <div class="text-2xl font-bold">Total</div>
                <input readonly class="text-end mr-10 outline-none" bind:value={total_str}>
            

            </div>
        </div>

        <button class:hidden={payment} on:click = {()=>{if(ordered_items.length > 0){payment=true}}} class="min-h-[80px] w-full flex items-center justify-center font-bold border-b-2 border-2 border-zinc-600 border-l-white border-t-white bg-blue-600 rounded px-8 py-3 text-2xl text-zinc-100 mt-1">
        Proceed to Payment
        </button>
        <button class:hidden={!payment} on:click = {()=>{payment=false}} class="min-h-[80px] w-full flex items-center justify-center font-bold border-b-2 border-2 border-zinc-600 border-l-white border-t-white bg-blue-600 rounded px-8 py-3 text-2xl text-zinc-100 mt-1">
            Back
        </button>
    </div>



</div>