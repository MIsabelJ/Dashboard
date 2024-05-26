#!/bin/bash
# -*- coding: utf-8 -*-

curl -X 'POST' \
  'http://localhost:8080/empresa' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "nombre": "Buen Sabor",
  "razonSocial": "Buen sabor SA",
  "cuil": 30707009876
}'

curl -X 'POST' \
  'http://localhost:8080/empresa' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "nombre": "Parripollo Gutierrez",
  "razonSocial": "Gutierrez SA",
  "cuil": 30707009877
}'

# Sucursal 1 empresa 1
curl -X 'POST' \
  'http://localhost:8080/domicilio' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "calle": "San Martin",
  "numero": 1382,
  "cp": 5500,
  "piso": 0,
  "nroDpto": 0,
  "idLocalidad": 356
}'

curl -X 'POST' \
  'http://localhost:8080/sucursal' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "nombre": "Sucursal Benegas",
  "horarioApertura": "10:00:00",
  "horarioCierre": "23:30:00",
  "esCasaMatriz": true,
  "idDomicilio": 1,
  "idEmpresa": 1
}'

# Sucursal 2 empresa 1
curl -X 'POST' \
  'http://localhost:8080/domicilio' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "calle": "Las Heras",
  "numero": 374,
  "cp": 5500,
  "piso": 0,
  "nroDpto": 0,
  "idLocalidad": 352
}'

curl -X 'POST' \
  'http://localhost:8080/sucursal' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "nombre": "Sucursal Capital",
  "horarioApertura": "18:00:00",
  "horarioCierre": "02:00:00",
  "esCasaMatriz": false,
  "idDomicilio": 2,
  "idEmpresa": 1
}'

# Sucursal 1 empresa 2
curl -X 'POST' \
  'http://localhost:8080/domicilio' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "calle": "Gabriela Mistral",
  "numero": 199,
  "cp": 5509,
  "piso": 0,
  "nroDpto": 0,
  "idLocalidad": 377
}'

curl -X 'POST' \
  'http://localhost:8080/sucursal' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "nombre": "Sucursal Maipu",
  "horarioApertura": "10:00:00",
  "horarioCierre": "22:00:00",
  "esCasaMatriz": true,
  "idDomicilio": 3,
  "idEmpresa": 2
}'

# Sucursal 2 empresa 2
curl -X 'POST' \
  'http://localhost:8080/domicilio' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "calle": "Saenz Pena",
  "numero": 1024,
  "cp": 5507,
  "piso": 0,
  "nroDpto": 0,
  "idLocalidad": 158
}'

curl -X 'POST' \
  'http://localhost:8080/sucursal' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json; charset=UTF-8' \
  -d '{
  "nombre": "Sucursal Lujan",
  "horarioApertura": "10:00:00",
  "horarioCierre": "22:00:00",
  "esCasaMatriz": false,
  "idDomicilio": 4,
  "idEmpresa": 2
}'

# # Categoria 1
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Harinas",
#   "idSucursales": [1,3,4]
# }'

# # Categoria 2 
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Hamburguesas",
#   "idSucursales": [2,3,4],
#   "idSubCategorias": [5,6,7]
# }'

# # Categoria 3
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Pizzas",
#   "idSucursales": [1,2,3,4],
#   "idSubCategorias": [8,9,10,11]
# }'

# # Categoria 4
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Empanadas",
#   "idSucursales": [12,13,14],
# }'

# # Subcategoria 1 Hamburguesa
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Clasica",
#   "idCategorias": [2,3,4]
# }'

# # Subcategoria 2 hamburguesa
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Rustica",
#   "idCategorias": [2,3,4]
# }'

# # Subcategoria 3 hamburguesa
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Con cheddar",
#   "idCategorias": [2,3,4]
# }'

# # Subcategoria 1 pizza
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Muzzarella",
#   "idCategorias": [1,2,3,4]
# }'

# # Subcategoria 2 pizza
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Fugazzeta",
#   "idCategorias": [1,2,3,4]
# }'

# # Subcategoria 3 pizza
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Napolitana",
#   "idCategorias": [1,2,3,4]
# }'

# # Subcategoria 4 pizza
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Calabresa",
#   "idCategorias": [1,2,3,4]
# }'

# # Subcategoria 1 empanada
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Carne",
#   "idCategorias": [1,2,3,4]
# }'

# # Subcategoria 2 empanada
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Pollo",
#   "idCategorias": [1,2,3,4]
# }'

# # Subcategoria 3 empanada
# curl -X 'POST' \
#   'http://localhost:8080/categoria' \
#   -H 'accept: */*' \
#   -H 'Content-Type: application/json; charset=UTF-8' \
#   -d '{
#   "denominacion": "Jamon y queso",
#   "idCategorias": [1,2,3,4]
# }'
