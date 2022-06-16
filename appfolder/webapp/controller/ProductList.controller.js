sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], 

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

   function (Controller, JSONModel) {

	"use strict";
	return Controller.extend("appfolder.controller.ProductList", {
        onInit: function () {
            this.getAvailableServices();

           
            //var metadata = {};
            //metadata = JSON.stringify(metadata);
            //this.sendMetadata(metadata);
        },

        sendMetadata : function(metadata) {
            $.ajax({ //testFunction nog vervangen + metadata meegeven
                url: 'cap_service/catalog/sendMetadata',
                type: 'POST',
                dataType: "text",
                contentType: "application/json",
                data: JSON.stringify({"metadata": metadata}),
                crossDomain: true,
                processData: false,
                success: function(data){
                    console.log("success: "+data);
                },
                error: function(e){
                    console.log("error: "+e);
                    console.log(JSON.stringify(e))
                }
              });
        },

        servicePressed : function(oEvent){
           
            console.log("test service pressed1");
            console.log(oEvent)
            let sPath = oEvent.getSource()._aSelectedPaths[0]
            console.log(sPath)

            let oModel = this.getView().getModel();
            let oContext = oModel.getProperty(sPath);

            //info selected service
            console.log(oContext);

            let metaUrl = oContext.MetadataUrl;
            console.log(metaUrl);
            metaUrl = metaUrl.replaceAll('http://capservicewithuiapprouter.cfapps.us10.hana.ondemand.com', '');
            var modelUrl = metaUrl
            console.log(modelUrl);


            var XMLString;

            //metadata ophalen
            $.ajax({ 
                url: modelUrl,
                type: 'GET',
                contentType: "xml",
                crossDomain: true,
                processData: false,
                success: function(data){
                    console.log("success2: "+data);
                    XMLString = new XMLSerializer().serializeToString(data);
                    console.log(XMLString);

                    $.ajax({
                        url: 'cap_service/catalog/sendMetadata',
                        type: 'POST',
                        dataType: "text",
                        contentType: "application/json",
                        data:  JSON.stringify({ metadata : XMLString}),
                        crossDomain: true,
                        processData: false,
                        success: function(data){
                            console.log("success: "+data);
                        },
                        error: function(e){
                            console.log("error: "+e);
                            console.log(JSON.stringify(e))
                        }
                      });
                    
                },
                error: function(e){
                    console.log("error: "+e);
                    console.log(JSON.stringify(e))
                }
              });
              //console.log(XMLString);
              //this.sendMetadata(XMLString);

        },


        getAvailableServices : function(oEvent){
            //Filtering
            var filters = [];
            if(oEvent != undefined){
                var serviceName = oEvent.getSource().getValue();
                var filterServiceName = new sap.ui.model.Filter("Title",
                sap.ui.model.FilterOperator.Contains, serviceName);
                console.log("filter: "+serviceName);
                
                filters.push(filterServiceName);
            }

            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/");
            var oView = this.getView();

            console.log(oModel);
            oModel.read("/ServiceCollection", {
                filters: filters,
                success: function(data, response) {
                    console.log(data);
                    const jsonModel = new JSONModel();
                    jsonModel.setProperty("/services", data.results);
                    oView.setModel(jsonModel);
                },
                error: function(oError) {
                    console.log(oError);
                }
            });	
        }
	
    });
});