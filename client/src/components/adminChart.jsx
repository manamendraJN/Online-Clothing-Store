export default function AdminChart() {
    return (
    //   <div>
    //     <iframe
    //       style={{
    //         background: '#FFFFFF',
    //         border: 'none',
    //         borderRadius: '2px',
    //         boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
    //         width: '640px',
    //         height: '480px'
    //       }}
    //       src="https://charts.mongodb.com/charts-virtual_dressing-vylcize/embed/charts?id=663cfffc-dcee-4afc-8a63-002f0187b7cd&maxDataAge=60&theme=light&autoRefresh=true"
    //     ></iframe>
    //   </div>

<div class="bg-gradient-to-r from-pink-500 to-purple-500 p-8 font-sans">

      <div class="container mx-auto">

        <h2 class="text-4xl font-bold text-white mb-8">Admin Dashboard</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">

          <div class="bg-white rounded-lg shadow-md p-6 w-[400px]">
          <iframe
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
            width: '300px',
            height: '300px',
            marginLeft:'24px'
          }}
          src="https://charts.mongodb.com/charts-virtual_dressing-vylcize/embed/charts?id=663cfffc-dcee-4afc-8a63-002f0187b7cd&maxDataAge=60&theme=light&autoRefresh=true"
        ></iframe>
           

            <div class="mt-4">

              <p class="text-lg font-semibold text-gray-800">Total Products</p>


            </div>

          </div>

          <div class="bg-white rounded-lg shadow-md p-6 w-[400px]">
          <iframe
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
            width: '300px',
            height: '300px',
            marginLeft:'28px'

          }}
          src="https://charts.mongodb.com/charts-virtual_dressing-vylcize/embed/charts?id=663d0871-76b0-41f5-800a-e33348deb41c&maxDataAge=60&theme=light&autoRefresh=true "
        ></iframe>
            
            <div class="mt-4">

              <p class="text-lg font-semibold text-gray-800">Total Users</p>


            </div>

          </div>

          <div class="bg-white rounded-lg shadow-md p-6 w-[400px]">

          <iframe
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
            width: '300px',
            height: '300px',
            marginLeft:'24px'
          }}
          src="https://charts.mongodb.com/charts-virtual_dressing-vylcize/embed/charts?id=663d0e59-3ed7-4c01-86b0-b16228e58ac0&maxDataAge=3600&theme=light&autoRefresh=true"
        ></iframe>

            <div class="mt-4">

              <p class="text-lg font-semibold text-gray-800">Roles</p>


            </div>

          </div>

        </div>

      </div>

    </div>
    );
  }
  