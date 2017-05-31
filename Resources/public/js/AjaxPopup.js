/*
 * MIT License
 *
 * Copyright (c) 2017 Rémi Blaise
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function ( $ ) {

	$.extend({
		AjaxPopup: function(parameters) {
			var options, defaults = {
				// This is default configuration

				"overlay_color": "rgba(0,0,0,0.2)",
				"loader_color": "#3498db", // blue
				"loader_circle_color": "#f3f3f3", // light grey
				"use_loader": true,
				"loader": null, // e.g. $("#loader"),

				"open_now": false,
				"buttons_selector": "button[ajax-url]", // e.g. ".ajax_popup_button",

				"follow_links": true,
				"control_forms": true,
				"control_buttons": true,
			};

			function setOptions(parameters){
				removeButtonsControllers($(document));
				options = $.extend({}, defaults, parameters);
				buildLoader();
				configure();
				controlButtons($(document));

				if (options.open_now) {
					query(options.open_now);
				}
			}

			function configure(){
				overlay.css('background-color', options.overlay_color);
				loader.find('div')
					.css('border-color', options.loader_circle_color)
					.css('border-top-color', options.loader_color)
				;
			}

			if (!$.AjaxPopup.last_id) {
				$.AjaxPopup.last_id = 0;
			}
			var id = ++$.AjaxPopup.last_id;

			var body = $("body"),
				popup, overlay, loader,
				buttons
			;

			// Overlay

			function buildOverlay(){
				overlay = $('<div id="ajax_popup_overlay__' + id + '" class="ajax_popup_overlay"></div>');
				overlay.hide();

				overlay.on('click', function(event) {
					hide();
				});

				$(document).on('keydown', function(event) {
					if (event.which === 27) {
						hide();
					}
				});

				body.append(overlay);
			}

			function displayOverlay(){
				overlay.show();
			}

			function hideOverlay(){
				overlay.hide();
			}

			// Loader

			function buildLoader(){
				loader = options.loader || $('<div id="ajax_popup_loader__' + id + '" class="ajax_popup_loader"><div></div></div>');
				loader.hide();
				body.append(loader);
			}

			function displayLoader(){
				if (options.use_loader) {
					loader.show();
				}
			}

			function hideLoader(){
				loader.hide();
			}

			// Popup

			function buildPopup(){
				popup = $('<div id="ajax_popup_container__' + id + '" class="ajax_popup_container"></div>');
				popup.hide();
				body.append(popup);
			}

			function displayPopup(){
				popup.show();
			}

			function hidePopup(){
				popup.hide();
			}

			function changeContent(html){
				popup.html(html);
			}

			// Ajax

			function query(url, method, data) {
				hideAll();
				displayOverlay();
				displayLoader();
				// console.log(url);

				$.ajax(url, {
					'method': method,
					'data': data,
					'success': function(data, textStatus, jqXHR) {
						if (jqXHR.status == 200) {
							changeContent(data);
							if (options.control_buttons) {
								dispatchControlButtons(popup);
							}
							if (options.follow_links) {
								controlLinks(popup);
							}
							if (options.control_forms) {
								controlForms(url);
							}

							hideLoader();
							displayOverlay(); // In case of overlay has been hiden
							displayPopup();
						} else if (jqXHR.status == 205) {
							location.reload();
						} else {
							console.log('An unexpected behavior happened:\n' + jqXHR.status);
						}
					},
					'error': function(jqXHR, textStatus, errorThrown) {
						alert('An error ' + jqXHR.status + ' happened:\n' + errorThrown);
					}
				});
			}

			// Main functions

			function build(){
				if (!$.AjaxPopup.controlButtonsListeners) {
					$.AjaxPopup.controlButtonsListeners = [];
				}
				$.AjaxPopup.controlButtonsListeners.push(controlButtons);

				if (!$.AjaxPopup.hideMethods) {
					$.AjaxPopup.hideMethods = [];
				}
				$.AjaxPopup.hideMethods.push(hide);

				buildPopup();
				buildOverlay();
			}

			function hide(){
				hideLoader();
				hidePopup();
				hideOverlay();
			}

			function hideAll(){
				$.each($.AjaxPopup.hideMethods, function(i, hideMethod){
					hideMethod();
				});
			}

			// Control buttons

			function dispatchControlButtons(newPopup){
				$.each($.AjaxPopup.controlButtonsListeners, function(i, listener){
					listener(newPopup);
				});
			}

			function controlButtons(element){
				element.find(options.buttons_selector).on("click", function(event) {
					event.preventDefault();
					query(event.currentTarget.getAttribute('ajax-url'));
				});
			}

			function removeButtonsControllers(element){
				if (options) {
					element.find(options.buttons_selector).off("click");
				}
			}

			function controlLinks(){
				popup.find('a').on("click", function(event) {
					event.preventDefault();
					var target = event.currentTarget.getAttribute('target');
					if (!target || target === '_self') {
						query(event.currentTarget.getAttribute('href'));
					}

				})
			}

			function controlForms(source_url) {
				popup.find("form").on("submit", function(event) {
					event.preventDefault();
					var action = event.currentTarget.action || source_url;
					query(action, event.currentTarget.method, $(event.currentTarget).serialize());
				});
			}

			// Initialisation

			build();
			setOptions(parameters);

			return {
				display: query,
				hide: hide,
				hideAll: hideAll,
				getOptions: function() { return options; },
				setOptions: setOptions,
			};
		}
	});

}( jQuery ));
