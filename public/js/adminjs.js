


    $('.delClass').on('click', async function  (e) {
        await login_check()
        var $row = $(this).closest('tr')
        var id = $(this).attr('id')
        var nameTxt = $row.find('.storeName').text().trim();
        $('#delName').html(nameTxt)
        $('.btn-ok', '#deleteDealerModal').data('recordId', id);
        $("#deleteDealerModal").modal('show')

    });

    $('#deleteDealerModal').on('click', '.btn-ok', async function (e) {
        await login_check()
        var $modalDiv = $(e.delegateTarget);
        var id = $(this).data('recordId');
        $.ajax({
            type: "post",
            url: "/admin/deleteDealer",
            data: { id: id },
            success: function (response) {
                if (response.ok) {
                   toastr.success('Dealer Deleted Successfully...')
                    $('#' + id).parents("tr").remove();

                }
            }
        });

        $modalDiv.modal('hide')
    });


    //ban deatails    

    $('.banClass').on('click', async function (e) {
        await login_check()
        var $row = $(this).closest('tr')
        var id = $(this).attr('id')
        var nameTxt = $row.find('.storeName').text().trim();
        $('#banName').html(nameTxt)
        $('.btn-ok', '#banDealerModal').data('recordId', id);
        $("#banDealerModal").modal('show')

    });

    $('#banDealerModal').on('click', '.btn-ok', async function (e) {
       await login_check()
        var $modalDiv = $(e.delegateTarget);
        var id = $(this).data('recordId');
        $.ajax({
            type: "post",
            url: "/admin/banDealer",
            data: { id: id },
            success: function (response) {
                if (response) {
                    toastr.success('Dealer Banned...')
                    $('#' + id).parents("tr").remove();

                }
            }
        });

        $modalDiv.modal('hide')
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

