<svelte:head>
	<title>IT2555</title>
</svelte:head>

<div>
    <main class="container mx-auto my-8">
		<section class="mb-8">
			<h2 class="text-xl font-semibold mb-4">Overview</h2>
			<div class=" flex flex-wrap -mx-4">
				<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 mb-4">
					<a href="/receipt">
				  	<div class="bg-white rounded-lg shadow p-4">
						<h3 class="text-lg font-semibold mb-2">Food and Beverage</h3>
						<p class="text-gray-600">$84.00 spent</p>
				  	</div>
					</a>
				</div>
					
				<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 mb-4">
					<a href="/receipt">
				  	<div class="bg-white rounded-lg shadow p-4">
						<h3 class="text-lg font-semibold mb-2">Transportation</h3>
						<p class="text-gray-600">$10.00 spent</p>
				  	</div>
					</a>
				</div>
				<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 mb-4">
					<a href="/receipt">
				  	<div class="bg-white rounded-lg shadow p-4">
						<h3 class="text-lg font-semibold mb-2">Entertainment</h3>
						<p class="text-gray-600">$17.00 spent</p>
				  	</div>
					</a>
				</div>
				<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 mb-4">
					<a href="/receipt">
				  	<div class="bg-white rounded-lg shadow p-4">
						<h3 class="text-lg font-semibold mb-2">Shopping</h3>
						<p class="text-gray-600">$85.00 spent</p>
				  	</div>
					</a>
				</div>
				<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 mb-4">
					<a href="/receipt">
				  	<div class="bg-white rounded-lg shadow p-4">
						<h3 class="text-lg font-semibold mb-2">Others</h3>
						<p class="text-gray-600">$84.00 spent</p>
				  	</div>
					</a>
				</div>
			  </div>
		</section>
	</main>
	<h2 class="text-xl font-semibold mb-4">Expenditure</h2>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">Fairprice</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$69.00</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">08/01/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-orange-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Others</p>
		  </div>
		</div>
	</li>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">Koi Thé</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$4.50</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">02/02/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-indigo-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Food & Beverage</p>
		  </div>
		</div>
	</li>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">Golden Village</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$17.00</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">15/02/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-rose-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-rose-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Entertainment</p>
		  </div>
		</div>
	</li>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">Mickey Mouse Cardhouse</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$8.50</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">01/03/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-fuchsia-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-fuchsia-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Shopping</p>
		  </div>
		</div>
	</li>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">SgCarWash</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$15.00</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">13/03/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-orange-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Others</p>
		  </div>
		</div>
	</li>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">Hai Di Lau</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$200.00</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">05/04/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-indigo-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Food & Beverage</p>
		  </div>
		</div>
	</li>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">Caifan Industries</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$5.00</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">16/04/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-indigo-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Food & Beverage</p>
		  </div>
		</div>
	</li>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">SMRT</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$10.00</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">02/05/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-teal-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Transportation</p>
		  </div>
		</div> 
	</li>
	<hr>
	<li class="flex justify-between gap-x-6 py-5">
		<div class="flex gap-x-4">
		  <div class="min-w-0 flex-auto">
			<p class="text-sm font-semibold leading-6 text-gray-900">New Balance</p>
			<p class="mt-1 truncate text-xs leading-5 text-gray-500">$70.00</p>
		  </div>
		</div>
		<div class="hidden sm:flex sm:flex-col sm:items-end">
		  <p class="text-sm leading-6 text-gray-900">20/05/2023</p>
		  <div class="mt-1 flex items-center gap-x-1.5">
			<div class="flex-none rounded-full bg-fuchsia-500/20 p-1">
			  <div class="h-1.5 w-1.5 rounded-full bg-fuchsia-500"></div>
			</div>
			<p class="text-xs leading-5 text-gray-500">Shopping</p>
		  </div>
		</div>
	</li>
	<hr>


</div>