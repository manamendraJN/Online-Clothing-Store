export default function UserChart() {
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

        <h2 class="text-4xl font-bold text-white mb-8">User Dashboard</h2>

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
          src="https://charts.mongodb.com/charts-virtual_dressing-vylcize/embed/charts?id=663d11e4-3ed7-4edf-8fa8-b162281d1820&maxDataAge=3600&theme=light&autoRefresh=true"
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
            marginLeft:'28px'

          }}
          src="https://charts.mongodb.com/charts-virtual_dressing-vylcize/embed/charts?id=663d17ea-e35e-4e4b-8992-8d43e8819478&maxDataAge=60&theme=light&autoRefresh=true "
        ></iframe>
            
            <div class="mt-4">

              <p class="text-lg font-semibold text-gray-800">Brands</p>


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
          src="https://charts.mongodb.com/charts-virtual_dressing-vylcize/embed/charts?id=663d1993-6070-4250-8ad9-a8552ae03411&maxDataAge=60&theme=light&autoRefresh=true"
        ></iframe>

            <div class="mt-4">

              <p class="text-lg font-semibold text-gray-800">Garment Types</p>


            </div>

          </div>

        </div>

      </div>

    </div>
    );
  }
  