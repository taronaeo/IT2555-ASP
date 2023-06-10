<script>
    let input_num = '';
    let item = []
    function addItem(){
        if (input_num==='123123'){
        input_num = '';
        item.push(apple);
        item = item
        }
    }

    let apple = {
        "id": 123123,
        "name": "Apple",
        "price": "4.50"
    }
    ;
</script>

<div class=" -mb-12 overflow-scroll grid grid-cols-8 gap-x-8">
        <div class="shadow-lg min-h-[85%] max-h-[85%] border-2 p-4 flex justify-center col-span-5">
            
            <div class="w-10/12  px-2 grid grid-cols-3 grid-rows-5 gap-y-3">
                <div class = "col-span-3 text-center font-bold text-xl ">
                    Scan Item Barcode or Enter Item ID
                    <input bind:value={input_num} class="rounded-lg mb-4 text-xl border-2 border-emerald-600 py-4  text-center w-full " readonly>
                </div>
                <div class = "flex justify-left">
                    <button on:click={() => input_num += '1'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            1
                        </div>
                    </button>
                </div>

                <div class = "flex justify-center">
                    <button on:click={() => input_num += '2'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            2
                        </div>
                    </button>
                </div>

                <div class = "flex justify-end">
                    <button on:click={() => input_num += '3'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            3
                        </div>
                    </button>
                </div>

                <div class = "flex justify-left">
                    <button on:click={() => input_num += '4'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            4
                        </div>
                    </button>
                </div>

                <div class = "flex justify-center">
                    <button on:click={() => input_num += '5'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            5
                        </div>
                    </button>
                </div>

                <div class = "flex justify-end">
                    <button on:click={() => input_num += '6'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            6
                        </div>
                    </button>
                </div>

                <div class = "flex justify-left">
                    <button on:click={() => input_num += '7'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            7
                        </div>
                    </button>
                </div>

                <div class = "flex justify-center">
                    <button on:click={() => input_num += '8'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            8
                        </div>
                    </button>
                </div>

                <div class = "flex justify-end">
                    <button on:click={() => input_num += '9'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            9
                        </div>
                    </button>
                </div>

                <div class = "flex justify-left">
                    <button on:click={() => input_num = input_num.slice(0, -1)}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            Back
                        </div>
                    </button>
                </div>

                <div class = "flex justify-center">
                    <button on:click={() => input_num += '0'}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            0
                        </div>
                    </button>
                </div>

                <div class = "flex justify-end">
                    <button on:click={addItem}>
                        <div class = "border-2 border-black w-36 h-20 rounded-lg flex justify-center items-center ">
                            Enter
                        </div>
                    </button>
                </div>
                
            </div>

            
            
        </div>
        
    <div class=" overflow-scroll max-h-[85%] col-span-3">
        <div class='py-4 flex border-t-4 border-emerald-600'>
            <div class = "grid grid-cols-3 w-full">
                <div class="  text-xl font-bold col-span-2">
                    Item
                </div>
                <div class = "text-xl font-bold col-span-1 flex justify-end   ">
                    Price
                </div>
                <hr class = "my-4 col-span-3 border-2 ">
                
                <div class=" col-span-2">
                    Apple (ID:<span class="">123123</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $4.50
                </div>

               

                <div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div>
                <div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div>
                <div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div><div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div><div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div><div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div><div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div><div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div><div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div><div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div><div class=" col-span-2">
                    Toyota Supra (ID:<span class="">392031</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    $999.99
                </div>
                {#each item as { id, name, price }}
                <div class=" col-span-2">
                    {name} (ID:<span class="">{id}</span>)
                </div>
                <div class = " col-span-1 flex justify-end   ">
                    ${price}
                </div>
                {/each}

                <hr class = "my-4 col-span-3 border-2 ">
                <div class="  text-xl font-bold col-span-2">
                    Total (incl.GST)
                </div>
                <div class = "text-xl font-bold col-span-1 flex justify-end   ">
                    $403.92
                </div>
                
                
                
                
            </div>
        </div>
    </div>
</div>

<div class="text-right">
    <button class="py-2.5 px-5 rounded-xl bg-emerald-600 text-white text-4xl">Checkout</button>
</div>