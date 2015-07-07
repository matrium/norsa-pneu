function initDropdown(element) {
    element.dropdown();
}

function toggleChevronUpDOwn(element) {
    element.find('.icon').toggleClass('fa-chevron-down');
    element.find('.icon').toggleClass('fa-chevron-up');
}

function capitalizeLetter(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function parseCities(data, local){
    var cities = [];
    //if country selector is active
    if(local) {
        for(var k = 0; k < data[local].length; k++) {
            cities[k] = capitalizeLetter(data[local][k]);
        }
    }
    //if not we display all cities from all countries
    else {
        var key = Object.keys(data);
        var c = 0;
        for(var i = 0; i < key.length; i++) {
            for(var j = 0; j < data[key[i]].length; j++) {
                cities[c] = capitalizeLetter(data[key[i]][j]);
                c++;
            }
        }
    }
    $('#query').typeahead({
        selector: {
            dropdown: 'dropdown-menu dropdown-menu-right',
            list: 'dropdown-menu',
            hint: 'form-control'
        },
        source: {
            data: cities
        }
    });
}

function initCookieLaw () {
    if($.cookie('allowCookies') == null) {
        $('.cookielaw').show();
    }
}

function closeCookieAlert () {
    $.cookie('allowCookies', 'allow', {expires: 30});
    $('.cookielaw').hide();
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,''])[1].replace(/\+/g, '%20'))||null;
}

function scrollToItem (tabId) {
    $('html, body').animate({
        scrollTop: $('#' + tabId).offset().top - 64
    });
    return false;
}

function initSelect (element) {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        return false;
    }
    else {
        element.selectpicker('render');
    }
}

$.fn.smartTagOrder = function(option) {
    return this.each(function() {
        var $this = $(this);
        var nbCol;
        if (typeof option === 'string' || typeof option === 'number') {
            nbCol = parseInt(option);
        } else {
            nbCol = 2;
        }
        var stArrElt = [];
        $this.find('[data-st-ordered^="index"]').each(function() {
            var stclass = $(this).attr('data-st-ordered');
            stclass = stclass.replace('index', '');
            if (stclass !== '') {
                stArrElt[stclass] = $(this);
            }
        });
        for (var ist = 0; ist < stArrElt.length; ist++) {
            $($this).append(stArrElt[ist]);
        }
        ist = 0;
    });
};

$(document).ready(function() {

    var originFromUrl = getURLParameter('origin'),
        lastKnowOrigin;

    if(originFromUrl !== null) {
        $.cookie('origin', originFromUrl, { path: '/' });
        lastKnowOrigin = originFromUrl;
    }
    else {
        //Use the existing cookie value
        lastKnowOrigin = $.cookie('origin');
    }

    //If the origin is a mobile app
    if(lastKnowOrigin === 'mobileapp') {
        $('.header, .footer').addClass('hidden-xs');
    }

    //Initialize cookielax
    initCookieLaw();

    //Create cookie when click on any link
    $('a').click(function (){
        closeCookieAlert();
    });

    //Uncomment if you want keep dropdown open after click
    /*$('.dropdown input, .dropdown-menu, .dropdown label, .dropdown form, .dropdown .filters').click(function(e) {
        e.stopPropagation();
    });*/

    //Ordered smart tags
    $('.sorted-columns').smartTagOrder();


    //Show/hide new search button on LIST & POS page
    $('.newsearch-button').click(function(){
        $('.result-searchform, .pos-searchform').slideToggle();
        $(this).find('.icon').toggleClass('fa-chevron-down');
        $(this).find('.icon').toggleClass('fa-chevron-up');
    });


    //Simulate click on checkbox when click on list
    $('.searchform-dropdown li').click(function() {
        $(this).find('input:checkbox').trigger('click');
    });

    //Initialize dropboxn
    initDropdown($('.dropdown-toggle'));


    //Initialize Carousel
    $('.carousel').each(function() {
        if($(this).length > 0) {
            $(this).find('.carousel-inner .item:first, .carousel-indicators li:first').addClass('active');
            $(this).carousel({
                interval: 5000
            });

            $(this).hammer().on('swipeleft', function(){
                $(this).carousel('next');
            });
            $(this).hammer().on('swiperight', function(){
                $(this).carousel('prev');
            });
        }
    });

    //Toggle chevron Up/Down
    $('.pos-content-inner-title, .pos-content-inner-content-title').click(function() {
        toggleChevronUpDOwn(this);
    });

    //Go on POS page
    $('.result-content-pos-link').click(function(e) {
        e.preventDefault();
        if(e.target.className.indexOf('result-content-pos-showphone') < 0) {
            var linkHref = $(this).attr('href');
            if (linkHref) {
                window.location.href = linkHref;
            }
        }
    });

    //Autocomplete (Start)
    $('#country').change(function(){
        var localUpdate = $('#country').val();
        parseCities(dataJson, localUpdate);
    });

    var localCountry = $('#country').val();
    var dataJson;
    $.ajax({
        url: window.location.origin + '/cities.json',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            dataJson = data;
            parseCities(data, localCountry);
        }
    });
    //Autocomplete (End)

    //Form Validation (Start)
    $('.searchform form, .home-search-nav form').formValidation({
        framework: 'bootstrap',
        // Excluding disabled is required for using with bootstrap-select
        excluded: ':disabled',
        err: {
            container: '.popover-content'
        }
    })
    .on('err.field.fv', function() {
        $('.searchform-query').popover({
            html: true,
            trigger: 'manual',
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
        });
        $('.searchform-query').popover('show');
    })
    .on('success.field.fv', function() {
        $('.searchform-query').popover('destroy');
    });

    $('#contact_request_form_st_lead_birthday, #contact_request_form_st_lead_city').addClass('form-control');
    $('#contact_request_form_st_lead_type, #contact_request_form_st_lead_travel, #contact_request_form_st_lead_budget, #contact_request_form_st_lead_connaissance').attr('data-width', '100%');
    $('#contact_request_form_st_lead_type, #contact_request_form_st_lead_travel, #contact_request_form_st_lead_budget, #contact_request_form_st_lead_connaissance').selectpicker();
    $('#contact_request_form_st_lead_birthday').attr('placeholder', 'jj/mm/aaaa');
    $('#contact_request_form_st_lead_birthday').attr('data-fv-date', 'true');
    $('#contact_request_form_st_lead_birthday').attr('data-fv-date-format', 'DD/MM/YYYY');

    $('#new_contact_request_form').formValidation({
        framework: 'bootstrap'
    })
    .on('success.form.fv', function() {
        return false;
    })
    .on('success.field.fv', function(e, data) {
        if (data.fv.getSubmitButton()) {
            data.fv.disableSubmitButtons(false);
        }
    });

    $('#pos-itinerary-content-form').formValidation({
        framework: 'bootstrap'
    })
    .on('success.form.fv', function() {
        return false;
    });

    $('#new_newsletter_request_form').formValidation({
        framework: 'bootstrap'
    })
    .on('success.form.fv', function() {
        return false;
    });

    // If sms country is changed manually
    $('#address_request_form_phone_country_code').change(function() {
        // Getting the country code corresponding to the selected country
        var codeSelected = $(this).children('option:selected').data('country-code');
        // Assigning it to a hidden select.
        $('#address_request_form_phone_country_iso').val(codeSelected);

        // Updating the language used in form validation
        $('#new_address_request_form').formValidation('updateOption', 'sms', 'validators', 'phone', 'country', codeSelected);
        // And revalidating the field.
        $('#new_address_request_form').formValidation('revalidateField', 'email');
        $('#new_address_request_form').formValidation('revalidateField', 'sms');
    });
    //Form Validation (End)

    //Set country and categorie to research value (Start)
    var countryCode = getURLParameter('country');
    var $countrySelector = $('.searchform-country');
    if(countryCode == null) {
        $.getJSON('/geocode.json', function(data){
            $countrySelector.find('option[value='+ data.country_code + ']').attr('selected', true);
            initSelect($countrySelector);
        });
    }
    else {
        $countrySelector.find('option[value='+ countryCode + ']').attr('selected', true);
        initSelect($countrySelector);
    }

    initSelect($('.searchform-filters'));
    //Set country and categorie to research value (End)

    //Show phone number
    $('.pos-content-showphone').click(function(){
        $(this).hide();
        $('.pos-content-phone, .pos-content-fax').show();
    });

    $(document).on('click', '.markerpopup-showphone', function(){
        $(this).hide();
        $('.markerpopup-phone').show();
    });

    $('.result-content-pos-showphone').click(function(e){
        e.stopPropagation();
        var posId = $(this).data('pos-id');
        $(this).hide();
        $('.result-content-pos-showphone[data-pos-id="' + posId + '"]').hide();
        $('.result-content-pos-phone[data-pos-id="' + posId + '"]').css('display','block');
    });

    //Fix tab bar
    var $posTabs = $('.pos-content-tabs');
    if($posTabs.length > 0) {
        //var tabFromTop = $posTabs.offset().top;
        $(window).scroll(function() {
            /*var scrollTop = $(this).scrollTop();
            if (scrollTop >= tabFromTop) {
                $posTabs.addClass('fixed');
                $('body').css({'padding-top': '64px'});
            } else {
                $posTabs.removeClass('fixed');
                $('body').css({'padding-top': '0'});
            }*/
            if ($('.pos-background-first:onScreen').length === 0) {
                $posTabs.addClass('fixed');
                $('body').css({'padding-top': '80px'});                
            } else {
                $posTabs.removeClass('fixed');
                $('body').css({'padding-top': '0'});
            }

        });
    }

    //Scroll tabs
    $('.pos-content-tabs-title:not(.dropdown-toggle)').click(function() {
        $('.pos-content-tabs-title').removeClass('active');
        $('.pos-content-tabs-item').removeClass('active');
        $(this).addClass('active');
        var tabId = $(this).data('id');
        scrollToItem(tabId);
    });

    $('.pos-content-tabs-item').click(function() {
        $('.pos-content-tabs-title').removeClass('active');
        $('.pos-content-tabs-item').removeClass('active');
        $('.pos-content-tabs-title.dropdown-toggle').addClass('active');
        $(this).addClass('active');
        var tabId = $(this).data('id');
        scrollToItem(tabId);
    });

    $(window).resize(function() {
        if(window.innerWidth > 769) {
            $('.result-searchform, .pos-searchform').show();
        }
        else{
            $('.result-searchform, .pos-searchform').hide();
        }
    });

    /* jshint ignore:start */
    //Opening left time
    var ctimeOpen = [];
    var ctimeClose = [];
    var timeBool = true;
    var today, diffClose, diffOpen;

    if($('.pos-hours-exceptionnal').length){
        var now = moment().format('YYYY-MM-DD');
        var dayTime = moment(now).utc().format('x');

        $('.meta-exceptional-hours').each(function(){
            var dayStart = moment($(this).find('meta').data('ctime-daystart'), 'YYYY-MM-DD').utc().format('x');
            var dayEnd  = moment($(this).find('meta').data('ctime-dayend'), 'YYYY-MM-DD').utc().format('x');
            if(!dayEnd) {
                dayEnd = dayStart;
            }
            if(dayTime >= dayStart && dayTime <= dayEnd) {
                var dataTimeOpenAm = $(this).find('meta').data('ctime-startam');
                var dataTimeOpenPm = $(this).find('meta').data('ctime-startpm');
                var dataTimeCloseAm = $(this).find('meta').data('ctime-endam');
                var dataTimeClosePm = $(this).find('meta').data('ctime-endpm');
                if(dataTimeOpenAm) {
                    ctimeOpen[0] = dataTimeOpenAm;
                }
                if(dataTimeOpenPm) {
                    ctimeOpen[1] = dataTimeOpenPm;
                }
                if(dataTimeCloseAm) {
                    ctimeClose[0] = dataTimeCloseAm;
                }
                if(dataTimeClosePm) {
                    ctimeClose[1] = dataTimeClosePm;
                }
                timeBool = false;
            }
        });
    }
    if(timeBool && $('.pos-hours-list').length) {
        var currentDay = new Date().getDay();
        if (currentDay === 0) {
            today = $('.lf_openinghoursdays .lf_days > li:nth-child(7)').first();
        } else {
            today = $('.lf_openinghoursdays .lf_days > li:nth-child('+ currentDay +')').first();
        }
        if(today.length) {
            today.addClass('today');
        }
        $('.lf_openinghoursdays .today .time div').each(function() {
            var dataTimeIndex = $(this).data('ctime-index');
            var dataTimeOpen = $(this).data('ctime-open');
            var dataTimeClose = $(this).data('ctime-close');
            if ($.isNumeric(dataTimeIndex)){
                ctimeOpen[dataTimeIndex] = dataTimeOpen;
                ctimeClose[dataTimeIndex] = dataTimeClose;
            }
        });
    }

    if(ctimeOpen && ctimeOpen.length !== 0) {
        if(ctimeOpen.length === 1) {
            diffOpen = moment(ctimeOpen[0], 'HH:mm').diff(moment());
            diffClose = moment(ctimeClose[0], 'HH:mm').diff(moment());
        }
        else {
            diffOpen = moment(ctimeOpen[0], 'HH:mm').diff(moment());
            diffClose = moment(ctimeClose[0], 'HH:mm').diff(moment());

            if(diffOpen <= 0 && diffClose <= 0) {
                diffOpen = moment(ctimeOpen[1], 'HH:mm').diff(moment());
            }
            if(diffClose <= 0) {
                diffClose = moment(ctimeClose[1], 'HH:mm').diff(moment());
            }
        }

        if(diffOpen > 0 || diffClose < 0 || diffClose <= 60000) {
            $('.pos-hours-open, .pos-hours-timer').hide();
            $('.pos-hours-closed').show();
        }
        else {
            var timeClose = moment.utc(diffClose).format('HH[h]mm');
            $('.pos-hours-timer-amount').text(timeClose);
            $('.pos-hours-closed').hide();
            $('.pos-hours-open, .pos-hours-timer').show();
        }
    }
    else {
        $('.pos-hours-open, .pos-hours-timer').hide();
        $('.pos-hours-closed').show();
    }
    /* jshint ignore:end */
});
