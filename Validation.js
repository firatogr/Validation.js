document.addEventListener('DOMContentLoaded', function(){
    const ajaxForms = document.querySelectorAll('.ajax-form');
    const regexs = document.querySelectorAll('[data-regex]');

    HTMLElement.prototype.validate = function(){
        [...this.elements].forEach(function(formElement) {
            formElement.isValidElement();
        });
    }

    HTMLElement.prototype.watchValidate = function(){
        [...this.elements].forEach(function(formElement){
            formElement.addEventListener('input', function(e){
                if(e.keyCode != 9 && e.keyCode != 20){
                    formElement.isValidElement();
                }                    
            });
            formElement.addEventListener('change', function(){
                formElement.isValidElement();
            });
        });
    }

    HTMLElement.prototype.sendIfIsValid = function(){
        if(this.checkValidity()){
            new FormData(this);
        }
    }

    HTMLElement.prototype.getResult = function(callback){
        this.addEventListener('formdata', function(e){
            const data = e.formData;
            const form = this;
            var request = new XMLHttpRequest();
            request.open(form.getAttribute('method'), REQUEST_URL + form.getAttribute('action'));
            request.addEventListener('load', function(response){
                if (response.currentTarget.status >= 200 && response.currentTarget.status < 400) {
                    form.querySelector('.info').classList.remove('error-info');
                    form.querySelector('.info').classList.remove('success-info');
                    var response = JSON.parse(response.currentTarget.response);
                    if(response.href){
                        setTimeout(function(){
                            window.location.href = response.href;
                        }, 2000);
                    }
                    if(response.posts.errors){
                        Object.entries(response.posts.errors).forEach(function(input){
                            if(inputError = form.querySelector('[name=\'' + input[0] + '\']')){
                                inputError.validationStatic(input[1]);
                            }
                        });
                    }
                    if(response.success){
                        form.querySelector('.info').classList.remove('error-info');
                        form.querySelector('.info').classList.add('success-info');
                        form.querySelector('.info').innerHTML = response.success;
                    }
                    if(response.error){
                        form.querySelector('.info').classList.remove('success-info');
                        form.querySelector('.info').classList.add('error-info');
                        form.querySelector('.info').innerHTML = response.error;
                    }
                } else {
                    callback('İşlem gerçekleştirilemedi.');
                }
            });
            request.addEventListener('error', function(response){
                callback('Lütfen bağlantınızı kontrol ediniz.');
            });
            request.send(data);
        });
    }

    HTMLElement.prototype.validationStatic = function(message){
        let parent = this;
        if(this.getAttribute('type') === 'radio' || this.getAttribute('type') === 'checkbox'){
            parent = this.closest('.radio-container') || this.closest('.checkbox-container');
        }
        this.closest('li').classList.add('error');
        this.closest('li').classList.remove('success');
        if (parent.nextElementSibling?.className !== 'error-message') {
            const error = document.createElement('small');
            error.className = 'error-message';
            error.innerText = message;
            parent.insertAdjacentElement('afterend', error);
        } else {
            parent.nextElementSibling.innerText = message;
        }
    }

    HTMLElement.prototype.isValidElement = function(){
        let parent = this;
        if(this.getAttribute('type') === 'radio' || this.getAttribute('type') === 'checkbox'){
            parent = this.closest('.radio-container') || this.closest('.checkbox-container');
        }
        if (!this.checkValidity()) {
            this.closest('li').classList.add('error');
            this.closest('li').classList.remove('success');
            if (parent.nextElementSibling?.className !== 'error-message') {
                const error = document.createElement('small');
                error.className = 'error-message';
                error.innerText = this.validationMessage;
                parent.insertAdjacentElement('afterend', error);
            } else {
                parent.nextElementSibling.innerText = this.validationMessage;
            }
        } else {
            this.closest('li').classList.remove('error');
            this.closest('li').classList.add('success');
            if (parent.nextElementSibling?.className === 'error-message') {
                parent.nextElementSibling.remove();
            }
        }
    }

    ajaxForms.forEach(function(form) {
        form.watchValidate();
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            form.querySelector('[type=\'submit\']').setAttribute('disabled', 'disabled');
            form.validate();
            form.sendIfIsValid();
            form.querySelector('[type=\'submit\']').removeAttribute('disabled');
        });
        form.getResult(function(response){
            console.log(response);
        });
    });

    regexs.forEach(function(input){
        input.addEventListener('input', function(e){
            if(e.keyCode != 9 && e.keyCode != 20){
                document.querySelectorAll('[data-rules=\'' + input.getAttribute('data-regex') + '\'] ul li').forEach(function(dataRule){
                    if(e.target.value.match(dataRule.getAttribute('data-rules-rule'))){
                        dataRule.classList.remove('error');
                        dataRule.classList.add('success');
                    } else {
                        dataRule.classList.remove('success');
                        dataRule.classList.add('error');
                    }
                });
            }
        });
    });
});

function c(t){console.log(t)}
function isEmpty(v){return (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) || (typeof v === 'object' && Object.keys(v).length === 0))}