

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



//calling delte Modal 
$('.delClass').on('click', async function (e) {
    e.preventDefault()
    await login_check()
    var $row = $(this).closest('tr')
    var id = $(this).attr('id')
    var nameTxt = $row.find('.productName').text().trim();
    $('#delName').html(nameTxt)
    $('.btn-ok', '#deleteProductModal').data('recordId', id);
    $("#deleteProductModal").modal('show')

});

//click confirm delet button to delete product and remove row (tr) from the table
$('#deleteProductModal').on('click', '.btn-ok', async function (e) {
    await login_check()
    var $modalDiv = $(e.delegateTarget);
    var id = $(this).data('recordId');

    $.ajax({
        type: "post",
        url: "/dealer/deleteProduct",
        data: { id: id },
        success: function (response) {
            if (response.ok) {
                toastr.success('Product Deleted  Successfully..')
                $('#' + id).parents("tr").remove();
            }
        }
    });

    $modalDiv.modal('hide')
});


// calling ban deatails modal

$('.banClass').on('click', async function (e) {

    await login_check()
    var $row = $(this).closest('tr')
    var id = $(this).attr('id')
    var nameTxt = $row.find('.productName').text().trim();
    $('#banName').html(nameTxt)
    $('.btn-ok', '#banProductModal').data('recordId', id);

    $("#banProductModal").modal('show')

});
//click to confirm ban button and ban the data and remove current tr from the table
$('#banProductModal').on('click', '.btn-ok', async function (e) {
    await login_check()
    e.preventDefault()
    var $modalDiv = $(e.delegateTarget);
    var id = $(this).data('recordId');
    $.ajax({
        type: "post",
        url: "/dealer/banProduct",
        data: { id: id },
        success: function (response) {
            if (response) {
                +
                toastr.success('Product Banned...')
                $('#' + id).parents("tr").remove();
            }
        }
    });
    $modalDiv.modal('hide')
});


//order status Change
$('.order-details').on('click', '.btn-sub', async function (e) {
    e.preventDefault()
    await login_check()
    var $this = $(this)
    let val = $this.parents('div').find('select').val()
    let id = $this.attr('id')
    if (val.length < 1) {
        $this.parents('div').find('select + span').html('')
        $this.parents('div').find('select').after('<span class="text-danger">select one</span>')
    } else {
        $this.parents('div').find('select + span').remove();
        $.ajax({
            type: "post",
            url: "/dealer/stateChange",//dealer-router
            data: {
                state: val, id: id
            },
            success: function (response) {

                if (response.ok == 1) {
                    toastr.success('State changed')
                    location.reload()
                }
            }
        });
    }


});
//View user Who ordered
$('.order-details').on('click', '.btn-view', async function (e) {
    e.preventDefault()
    await login_check()
    var $this = $(this)
    let orderId = $this.attr('id')
    var userId = $(this).data('userid');
    if (orderId.length > 1 && userId.length > 1) {
        $.ajax({
            type: "post",
            url: "/dealer/view-user-products",//dealer-router
            data: {
                userId: userId, orderId: orderId
            },
            success: function (response) {


                $('.modal-data', '#modalOrderProductsDetails').find('tbody').html(response.data)
                $('#total', '#modalOrderProductsDetails').html(response.grandTotal)
                $('.total-item', '#modalOrderProductsDetails').html(response.totalQuantity)
                $('#address', '#modalOrderProductsDetails').html(response.user)
                $('#modalOrderProductsDetails').modal('show')

            }
        });
    }

});