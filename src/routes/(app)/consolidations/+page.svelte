<svelte:head>
	<title>IT2555</title>
</svelte:head>

<div class="inline-flex relative pb-4">
    <ul class="flex flex-wrap px-3 py-1 bg-emerald-600 rounded-md text-base">
        <li class="relative mx-1 px-1 py-2 group bg-emerald-600 rounded-full mb-1 md:mb-0">
            <span class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-md focus:outline-none">Filter By</span>
            <ul class="absolute top-0 left-0 mt-10 p-2 rounded-lg shadow-lg bg-white z-10 hidden group-hover:block">
                <li class="p-1 whitespace-no-wrap rounded-full text-sm md:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                    <a class="px-2 py-1" href="consolidations">
                        <span class="">Chronological</span>
                    </a>
                </li>
                <li class="p-1 whitespace-no-wrap rounded-full text-sm md:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                    <a class="px-2 py-1" href="consolidations">
                        <span class="">Amount</span>
                    </a>
                </li>
                <li class="p-1 whitespace-no-wrap rounded-full text-sm md:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                    <a class="px-2 py-1" href="consolidations">
                        <span class="">Date</span>
                    </a>
                </li>
            </ul>
        </li>
    </ul>        
</div>


<div class="flex overflow-x-auto">
    <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
        <div class="min-w-0 flex-auto">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="fairprice logo .jpg" alt="">
            <p class="text-sm font-semibold leading-6 text-emerald-600">FairPrice</p>
        </div>
    </a>  
    <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
        <div class="min-w-0 flex-auto">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="koi the.jpg" alt="">
            <p class="text-sm font-semibold leading-6 text-emerald-600">Koi The</p>
        </div>
    </a>  
    <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
        <div class="min-w-0 flex-auto">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="logo.svg" alt="">
            <p class="text-sm font-semibold leading-6 text-emerald-600">SgCarWash</p>
        </div>
    </a>
    <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
        <div class="min-w-0 flex-auto">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="haidilau logo.jpg" alt="">
            <p class="text-sm font-semibold leading-6 text-emerald-600">haidilau</p>
        </div>
    </a>
    <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
        <div class="min-w-0 flex-auto">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="caifan logo.jpg" alt="">
            <p class="text-sm font-semibold leading-6 text-emerald-600">Caifan Industries</p>
        </div>
    </a>
    <a href="receipt" class="px-4 py-2 bg-gray-200 mr-2 rounded-lg">
        <div class="min-w-0 flex-auto">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="mickey mouse logo.jpg" alt="">
            <p class="text-sm font-semibold leading-6 text-emerald-600">Mickey Mouse CardHouse</p>
        </div>
    </a>
</div>

<div class="mx-auto font-bold text-2xl py-4">
    <h1>Transactions</h1>
</div>



<ul class="divide-y divide-gray-100">
    <a href="receipt">
        <div class="container mx-auto font-thin text-">
           January 8 2023, 09:23 AM
        <li class="flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="fairprice logo .jpg" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-emerald-600">FairPrice</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-500">PayNow</p>
            </div>
            </div>
            <div class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center" >
                <p class= "text-sm leading-6 text-emerald-600">R ID: 939203</p>
                <p class="text-sm leading-6 text-emerald-600">Amt: $69.00</p>
            </div>
        </li>
    </a>
    <hr>
    <a href="receipt">
        <div class="container mx-auto font-thin text-">
           Febuary 2, 2023, 03:30 PM
        </div>
        <li class="flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="koi the.jpg" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-emerald-600">Koi Thé</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-500">Cash</p>
            </div>
            </div>
            <div class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center">
                <p class= "text-sm leading-6 text-emerald-600">R ID: 939203</p>
                <p class="text-sm leading-6 text-emerald-600">Amt: $4.50</p>
            </div>
        </li>
    </a>
    <hr>
    <a href="receipt">
        <div class="container mx-auto font-thin text-">
            Febuary 15, 2023, 06:45 PM
        </div>
        <li class="flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="golden village logo.jpg" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-emerald-600">Golden Village</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-500">Paywave</p>
            </div>
            </div>
            <div class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center">
                <p class= "text-sm leading-6 text-emerald-600">R ID: 939203</p>
                <p class="text-sm leading-6 text-emerald-600">Amt: $17.00</p>
            </div>
        </li>
    </a>
    <hr>
    <a href="receipt">
        <div class="container mx-auto font-thin text-">
            March 1, 2023, 08:15 AM
        </div>
        <li class="flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="mickey mouse logo.jpg" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-emerald-600">Mickey Mouse CardHouse</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-500">Nets</p>
            </div>
            </div>
            <div class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center">
                <p class= "text-sm leading-6 text-emerald-600">R ID: 939203</p>
                <p class="text-sm leading-6 text-emerald-600">Amt: $8.50</p>
            </div>
        </li>
    </a>
    <hr>
    <a href="receipt">
        <div class="container mx-auto font-thin text-">
            March 13, 2023, 11:10 AM
        </div>
        <li class="flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="logo.svg" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-emerald-600">SgCarWash</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-500">Online Card Transaction</p>
            </div>
            </div>
            <div class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center">
                <p class= "text-sm leading-6 text-emerald-600">R ID: 939203</p>
                <p class="text-sm leading-6 text-emerald-600">Amt: $15.00</p>
            </div>
        </li>
    </a>
    <hr>
    <a href="receipt">
        <div class="container mx-auto font-thin text-">
            April 5, 2023, 02:00 AM
        </div>
        <li class="flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="haidilau logo.jpg" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-emerald-600">Hai Di Lau</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-500">PayWave</p>
            </div>
            </div>
            <div class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center">
                <p class= "text-sm leading-6 text-emerald-600">R ID: 939203</p>
                <p class="text-sm leading-6 text-emerald-600">Amt: $200</p>
            </div>
        </li>
    </a>
    <hr>
    <a href="receipt">
        <div class="container mx-auto font-thin text-">
            April 16, 2023, 07:55 PM
        </div>
        <li class="flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="caifan logo.jpg" alt="">
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-emerald-600">caifan Industries</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-500">Paylah</p>
            </div>
            </div>
            <div class="hidden sm:flex sm:flex-col sm:items-end justify-center items-center">
                <p class= "text-sm leading-6 text-emerald-600">R ID: 939203</p>
                <p class="text-sm leading-6 text-emerald-600">Amt: $5.00</p>
            </div>
        </li>
    </a>
</ul>
  
