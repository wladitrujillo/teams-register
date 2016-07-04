(function(angular){
    'use strict';


angular.module('TeamsApp')
    .controller('CantonCtrl',['CantonResource','$uibModal', '$filter' ,
        function (CantonResource, $modal , $filter) {
        var ctrl = this;        
       
        var gridDataSource = new kendo.data.DataSource({
            pageSize: 5,
            serverPaging:true,       
            transport: {
            read: function(options) {
                if (angular.isDefined(options.data)) {                 
                    var promise = CantonResource.query({page: (options.data.skip/options.data.pageSize)+1, per_page: options.data.pageSize},
                        function(result, headers){                          
                            options.success({"data":result,"total":headers('X-Total-Count')}); 
                    });                                              
                   
                };
                if (promise === false) {
                    options.error({                        
                        xhr: {}
                    });
                };
            }, 
            create: function(options) {
                var model = options.data;  
                delete model._id;
                CantonResource.save(model, function(response) {                       
                    if(response){                                                                       
                         options.success(model);                                    
                    }else{
                         options.error(model);
                    }
                },function(error){
                    console.log("Save error ",error);
                });
            },           
            destroy: function(options) {
                var model = options.data;               
                var promise = CantonResource.delete({id: model._id},function(response) {    
                    if(response){                                                                       
                         options.success(model);                                    
                    }else{
                         options.error(new Error('DeletingError'));
                    }
                });                   
            },
            update: function(options) {
                var model = options.data;             
                var promise = CantonResource.update({id:model._id}, model, function(response) {    
                    if(response){                                                                       
                         options.success(model);                                    
                    }else{
                         options.error(model);
                    }
                });             
            }                                          
        },
        schema: {
            total: function(response){
                return response.total;
            },
            data:function(response){
                
                return response.data;
            },
            model:{
                id:"_id",
                fields: {
                    code:{nullable:false},
                    name:{editable:true}
                }
            }
            
        },
        error: function(e) {
                    if (e.xhr.message && e.xhr.message == 'DeletingError') {
                        console.log("Error",e);
                    }
        }
    });

        var gridColumns = [  
            {
                field: "code",
                title: 'Codigo',
                width: "10%"                                     
            }, 
            {
                field: "name",
                title: 'Name',
                width: "75%"                                     
            }, 
            { command: [{
                id: "edit",
                name: "edit",
                template: "<a class='k-button k-grid-edit' href='' style='min-width:16px;'><span class='k-icon k-edit'></span></a>"
                },
                {
                id: "destroy",
                name: "destroy",
                template: "<a class='k-button k-grid-delete' href='' style='min-width:16px;'><span class='k-icon k-delete'></span></a>"
                },
                {
                id:"view",
                name:"view",               
                template: "<a class='k-button k-grid-edit' ui-sref='app.canton-detail({id:dataItem._id})' style='min-width:16px;'><span class='glyphicon glyphicon-eye-open'></span></a>"
                }], title: "&nbsp;", width: "15%" }];
             
        var toolbar = [ { name: "create", text: $filter('translate')('canton.home.createLabel') }/*,
            { template: "<input type='button' class='k-button' value='Email Users' onclick='sendEmail()' />",
              imageclass: "k-icon k-i-pencil" }*/]


        ctrl.toolbar = toolbar;
        ctrl.gridDataSource = gridDataSource;
        ctrl.gridColumns = gridColumns;         
       
  
    }]);
}(window.angular));