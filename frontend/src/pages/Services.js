import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [orderData, setOrderData] = useState({
    quantity: 1,
    link: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Error fetching services');
    }
  };

  const handleOrderChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateOrder = async (serviceId) => {
    if (!orderData.link) {
      toast.error('Please enter a link');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/orders', {
        serviceId,
        quantity: parseInt(orderData.quantity),
        link: orderData.link
      });
      toast.success('Order created successfully!');
      setOrderData({ quantity: 1, link: '' });
      setSelectedService(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Our Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-400 mb-2">Category: {service.category}</p>
              <p className="text-gray-400 mb-4">Type: {service.type}</p>
              <p className="text-2xl font-bold text-green-400 mb-4">${service.price}</p>
              
              <button
                onClick={() => setSelectedService(service._id)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-bold transition"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>

        {/* Order Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create Order</h2>
              
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={orderData.quantity}
                onChange={handleOrderChange}
                min="1"
                className="w-full bg-gray-700 p-2 rounded-lg mb-4 text-white"
              />

              <input
                type="text"
                name="link"
                placeholder="Link/URL"
                value={orderData.link}
                onChange={handleOrderChange}
                className="w-full bg-gray-700 p-2 rounded-lg mb-4 text-white"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => handleCreateOrder(selectedService)}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-bold transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Order'}
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;