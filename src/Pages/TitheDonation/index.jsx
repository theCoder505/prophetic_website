import { useEffect, useState } from "react";
import { AiFillEye, AiOutlineMenu } from "react-icons/ai";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { Link } from "react-router-dom";
import MenuBar from "../../Components/MenuBar";
import { API_DOMAIN } from "../../config";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import DataTable from "react-data-table-component";

const SeedDonation = () => {
  const [amount, setAmount] = useState(50);
  const [description, setDescription] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const userType = localStorage.getItem("userType");
  const userEmail = localStorage.getItem("email");
  const [paypalKey, setPaypalKey] = useState(0);
  const [showPayPal, setShowPayPal] = useState(false);
  const isFormComplete = firstName && lastName && amount && description;
  const [method, setMethod] = useState('paypal');

  const [filterText, setFilterText] = useState('');
  const [filteredPrayers, setFilteredDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');



  useEffect(() => {
    setPaypalKey((prevKey) => prevKey + 1);
  }, [firstName, lastName, amount, description]);



  const loadPayPalScript = async () => {
    try {
      const response = await fetch(API_DOMAIN + '/paypal-client-id');
      console.log(response);
      const { clientId } = await response.json();

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.async = true;
      script.onload = initializePayPalButtons;
      document.body.appendChild(script);
    } catch (error) {
      console.error('Failed to load PayPal script:', error);
    }
  };

  // Initialize PayPal buttons after SDK loads
  const initializePayPalButtons = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        onClick: (data, actions) => {
          const fundingSource = actions.fundingSource;
          if (fundingSource === window.paypal.FUNDING.PAYPAL) setMethod('paypal');
          if (fundingSource === window.paypal.FUNDING.PAY_LATER) setMethod('payLater');
          if (fundingSource === window.paypal.FUNDING.CARD) setMethod('debitCard');
          return actions.resolve();
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount || "0.0",
              },
              description: description || "No description",
            }],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          submitDonation(
            order.payer.email_address,
            order.payer.name.given_name,
            order.payer.name.surname,
            order.payer.payer_id,
            order.status,
            order.id,
            order.purchase_units[0].payee.merchant_id,
          );
        },
        onError: (err) => {
          console.error('Payment Error:', err);
        },
      }).render('#paypal-button-container');
    }
  };

  // UseEffect to trigger PayPal script loading
  useEffect(() => {
    if (showPayPal) loadPayPalScript();
  }, [showPayPal]);

  const submitDonation = async (
    payer_mail,
    payer_fname,
    payer_lname,
    payer_id,
    order_status,
    order_id,
    merchant_id,
  ) => {
    const donationData = {
      method,
      userType,
      userEmail,
      firstName,
      lastName,
      amount,
      description,
      payer_mail,
      payer_fname,
      payer_lname,
      payer_id,
      order_status,
      order_id,
      merchant_id,
    };

    try {
      const response = await fetch(`${API_DOMAIN}/tithe-donation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        await response.json();
        setAmount(0);
        setDescription('');
        setLastName('');
        setFirstName('');
        setShowPayPal(false);
        toast.success('Seed Donation Successful!');
      } else {
        console.error('Donation failed:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };







  // for tithe donations to master admin 
  const handleDescriptionClick = (description) => {
    setSelectedDescription(description);
    setShowModal(true);
  };




  useEffect(() => {
    if (userType == 'master') {

      axios.post(
        `${API_DOMAIN}/fetch-tithe-donations`,
        { userType, userEmail },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      )
        .then((response) => {
          if (userType === 'master') {
            const filteredData = response.data.seeds.filter(
              (prayer) =>
                prayer.userType.toLowerCase().includes(filterText.toLowerCase()) ||
                prayer.firstName.toLowerCase().includes(filterText.toLowerCase()) ||
                prayer.lastName.toLowerCase().includes(filterText.toLowerCase()) ||
                prayer.amount.toLowerCase().includes(filterText.toLowerCase()) ||
                prayer.userEmail.toLowerCase().includes(filterText.toLowerCase())
            );
            setFilteredDonations(filteredData);
          } else {
            setFilteredDonations(response.data.seeds);
          }
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    }
  }, [userType, userEmail, filterText]);





  // Define columns for DataTable
  // Define columns for DataTable
  const columns = [
    { name: 'ID', selector: (row, index) => index + 1, sortable: true },
    {
      name: 'User Type',
      cell: (row) => (
        <span className="bg-black text-white px-4 py-2 rounded">
          {row.userType === 'Admin' ? 'Leader' : 'Member'}
        </span>
      ),
      sortable: true
    },
    { name: 'Name', selector: (row) => row.firstName + ' ' + row.lastName, sortable: true },
    { name: 'Email', selector: (row) => row.userEmail, sortable: true },
    { name: 'Amount', selector: (row) => row.amount, sortable: true },
    {
      name: 'Description',
      cell: (row) => (
        <button
          onClick={() => handleDescriptionClick(row.description)}
          className="bg-purple-800 py-1 px-4 text-white text-xl rounded"
        >
          <AiFillEye />
        </button>
      )
    },

    { name: 'PayerMail', selector: (row) => row.payer_mail },
    { name: 'Payer Fname', selector: (row) => row.payer_fname },
    { name: 'Payer Lname', selector: (row) => row.payer_lname },
    { name: 'Order ID', selector: (row) => row.order_id },
    { name: 'Payer ID', selector: (row) => row.payer_id },
    { name: 'Merchant ID', selector: (row) => row.merchant_id },
    {
      name: 'Status',
      cell: (row) => (
        <span className="bg-teal-700 text-white text-xs px-2 py-1 rounded">
          {row.order_status}
        </span>
      ),
    },
    {
      name: 'Created At',
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
      },
    },
  };



  return (
    <div className="sm:flex sm:flex-row sm:space-x-5 bg-slate-50 text-black">
      <DashBoard />
      <div className="w-screen flex flex-col min-h-screen h-full justify-between bg-slate-50">
        <div className="sm:w-full ">
          <div>
            <div>
              <div className="bg-white h-full">
                <div className="spec_header">
                  <div className="flex row space-x-2 ml-8 items-center">
                    <AiOutlineMenu className="sm:hidden" />
                  </div>
                  <div className="flex row space-x-20 pl-10 pt-2 pr-10 w-30 pb-1 font-roboto-slab">
                    <div>
                      <Link to={"/seeddonations"} className="text-xl text-gray-400 font-medium">Seed Donation </Link>
                    </div>
                    <div>
                      <Link to={"/tithedonations"} className="text-xl text-white">Tithe Donation</Link>
                    </div>
                  </div>
                </div>



                <div className={`px-8 py-4 ${userType !== 'master' ? '' : 'hidden'} `}>
                  <div className="flex row justify-between">
                    <p className="w-40 sm:w-96 text-gray-400">
                      Give 10% of ones income to the church regularly as an act of
                      worship and obedience to God with the belief  that it will bring
                      blessings, prosperity, rewards from G
                    </p>
                    <img
                      className="max-h-40 pt-2 lg:w-[130px] lg:max-h-[100px]"
                      src="/capa-1.svg"
                      alt=""
                    />
                  </div>




                  <div className="flex row space-y-3 mb-28">
                    <form className="w-full flex flex-col space-y-3">
                      <label htmlFor="fullName">Full Name:</label>
                      <div className="flex flex-row gap-6">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          required
                          onChange={(e) => setFirstName(e.target.value)}
                          className="px-4 py-2 border border-black-500 rounded-lg w-full"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          required
                          onChange={(e) => setLastName(e.target.value)}
                          className="px-4 py-2 border border-black-500 rounded-lg w-full"
                        />
                      </div>

                      <label htmlFor="Donation">Donation:</label>
                      <div className="border border-black-500 rounded-lg flex justify-between items-center">
                        <input
                          type="number"
                          value={amount}
                          required
                          className="px-4 py-2 border-none focus:outline-none w-full"
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.0"
                        />
                        <span className="text-gray-400 pr-4">USD</span>
                      </div>

                      <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="px-4 py-2 border border-black-500 rounded-lg overflow-hidden"
                        placeholder="Description..."
                      ></textarea>

                      {!showPayPal ? (
                        <button
                          type="button"
                          className="submit_btn"
                          onClick={() => setShowPayPal(true)}
                          disabled={!isFormComplete}
                        >
                          Donate
                        </button>
                      ) : (
                        <>
                          <label htmlFor="Payment">Payment Method:</label>
                          <div id="paypal-button-container" key={paypalKey} className="mt-4"></div>
                        </>
                      )}
                    </form>
                  </div>






                </div>





                {userType === 'master' && (
                  <>
                    <div className='px-8 py-4'>
                      <h2 className="text-center text-gray-500 text-2xl font-bold mt-10">
                        All Prayers
                      </h2>

                      {/* Search Bar */}
                      <div className="my-4">
                        <input
                          type="text"
                          placeholder="Filter by usertype, name, email, amount"
                          className="border border-gray-300 p-2 w-full"
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                        />
                      </div>

                      <div className="max-w-[48vw] overflow-auto pb-10">
                        <DataTable
                          columns={columns}
                          data={filteredPrayers}
                          pagination
                          customStyles={customStyles}
                          highlightOnHover
                          defaultSortFieldId={1}
                        />
                      </div>
                    </div>


                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                          <h2 className="text-lg font-bold mb-4">Full Description</h2>
                          <p>{selectedDescription}</p>
                          <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
        <Toaster />
        <div className="lg:hidden">
          <MenuBar />
        </div>
      </div>


      <SideBoard />

    </div>
  );
};

export default SeedDonation;
