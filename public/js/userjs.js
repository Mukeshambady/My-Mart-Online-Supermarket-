$('.modalCart').on('click', async function (e) {
    await login_check()

    $.ajax({
        type: "post",
        url: "/cart-modal",//user-router

        success: function (response) {

            if (response) {

                $('#total', '#modalCartDetails').html(response.totals.total)
                $('.total-item', '#modalCartDetails').html(response.totals.total_qty)
                $('.modal-data', '#modalCartDetails').html(response.data)
                $('#checkout-form').find('textarea[ name=address]').val(response.user.address);
                $('#checkout-form').find('input[ name=email]').val(response.user.email);
                $('#checkout-form').find('input[ name=phonenumber]').val(response.user.phoneNumber);
            }
        }
    });

    $("#modalCartDetails").modal('show')

});
//Check out
$("#checkout-form").submit(async (e) => {
    e.preventDefault()
    await login_check()
    if ($('#total').html().trim() > 0) {
        $.ajax({

            url: "/check-out",//user-router
            method: 'post',
            data: $('#checkout-form').serialize(),

            success: function (response) {

                //response.data.grandTotal $this.closest('div').find('input[ name=name]');
                if (response.data) {
                  
                    $('#total', '#modalCartDetails').html(response.totals.total)
                    $('.total-item', '#modalCartDetails').html(response.totals.total_qty)
                    $('#cartcount').html(response.cartCount)
                    if (response.data.paymentMethod == 'ONLINE') {
                        response.response.email = $('#checkout-form').find('#email').val();
                        response.response.phonenumber = $('#checkout-form').find('#phone-number').val();
                        $("#modalCartDetails").modal('hide')
                        razorpayPayment(response.response)
                    } else {
                        done()
                    }
                }
            }
        });
    } else {
        toastr.warning('select One item')
        $("#modalCartDetails").modal('hide')
    }

});
function done() {
    toastr.success('your order has been placed successfully')
    $("#modalCartDetails").modal('hide')
}

//razorpay 
function razorpayPayment(order) {
    
    var options = {
        "key": "rzp_test_KWvH4bD4JuWd8e", // Enter the Key ID generated from the Dashboard
        "amount": (parseInt(order.amount)), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "CrossRoads",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            verifyPayment(response, order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            // "email": "gaurav.kumar@example.com",
            "email": order.email,
            "contact": order.phonenumber
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    //rasorpay

    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        $("#modalCartDetails").modal('hide')
    });
    rzp1.open();
}

function verifyPayment(payment, order) {

    $.ajax({
        url: '/verify-payment',
        data: {
            payment,
            order
        },
        method: 'post',
        success: (data) => {

            if (data.status) {
                done()
            } else {
                $("#modalCartDetails").modal('hide')
            }
        },

    })
}


/*-- Modal: modalCart --*/

// $('.minus-btn', '#modalCartDetails').on('click', function (e) {
$('#modalCartDetails').on('click', '.minus-btn', async function (e) {
    e.preventDefault();
    await login_check()
    var $this = $(this);
    var $input = $this.closest('div').find('input[ name=name]');
    var value = parseInt($input.val());
    let productId = $this.closest('div').find('input[ name=productId]').val()
    if (value > 1) {
        value = value - 1;
        //quantity
        $.ajax({
            type: "post",
            url: "/quantity",//user-router
            data: {
                productId: productId, quantity: -1
            },
            success: function (response) {
                if (response.data) {
                    $input.val(value);
                    $('#total', '#modalCartDetails').html(response.totals.total)
                    $('.total-item', '#modalCartDetails').html(response.totals.total_qty)
                }
            }
        });
    } else {
        value = 1;
    }

});

$('#modalCartDetails').on('click', '.plus-btn', async function (e) {
    e.preventDefault();
    await login_check()
    var $this = $(this);
    var $input = $this.closest('div').find('input[ name=name]');
    var value = parseInt($input.val());
    let productId = $this.closest('div').find('input[ name=productId]').val()
    if (value < 100) {
        value = value + 1;
    } else {
        value = 100;
    }


    $.ajax({
        type: "post",
        url: "/quantity",//user-router
        data: {
            productId: productId, quantity: 1
        },
        success: function (response) {
            if (response.data) {
                $input.val(value);
                $('#total', '#modalCartDetails').html(response.totals.total)
                $('.total-item', '#modalCartDetails').html(response.totals.total_qty)
            }
        }
    });
});

$('#modalCartDetails').on('click', '.remove-product', async function (e) {
    e.preventDefault();
    await login_check()
    var $this = $(this);

    let productId = $this.closest('div').find('input[ name=productId]').val()

    $.ajax({
        type: "post",
        url: "/remove-from-cart",//user-router
        data: {
            productId: productId
        },
        success: function (response) {

            if (response.data) {

                $('#total', '#modalCartDetails').html(response.totals.total)
                $('.total-item', '#modalCartDetails').html(response.totals.total_qty)
                $('#cartcount').html(response.cartCount)
            }
        }
    });
});

//get alltotals
function getAllTotalCounts() {

}





//orderHistory
$('.orderHistory').on('click', async function (e) {
    await login_check()
    $.ajax({
        type: "post",
        url: "/order-history-modal",//user router
        success: function (response) {

            if (response) {
                $('.modal-data', '#modalOredrHistory').html(response)
            }
        }
    });

    $("#modalOredrHistory").modal('show')

});






//login check Ajax
function login_check() {
    $.ajax({
        type: "post",
        url: "/verifyLoginByAjax",
        success: function (response) {
            if (response) {
                return true
            } else {
                location.assign("/login");
                return false
            }
        }
    });
}

