
# Triveous Assignment

Build an API to support e-commerce operations, such as product and category
listing, product details, cart management, and order processing.




## Run Locally

Clone the project

```bash
  git clone https://github.com/Sagarkbk/Triveous-Assignment.git
```

Go to the project directory

```bash
  cd Triveous-Assignment
```
Environmental Variables

```bash
  DATABASE_URL //local postgresql or any other connection string
  JWT_SECRET  //Any random secret
```

Install dependencies

```bash
  npm install
```

Prisma

```bash
  npx prisma init
  npx prisma migrate dev --name initial_migration
  npx prisma studio //Opens Prisma GUI
```

Start the server

```bash
  nodemon index.js
```


## API Reference

### Important points:
##### 1. First, signin or signup. You'll get jwt token.
##### 2. Add Bearer at the start(Example: Bearer tokenValue). Put it in Headers as Authorization.
##### 3. Hit the user/populateDB endpoint.
##### 4. Now you're good to test out any other endpoint.
### User Signup

```http
  POST /user/signup
```
Request Body

| Body      | Type     | Description                    |
| :-        | :-       | :-                             |
| `email`   | `string` | Account Email(**Required**)    |
| `password`| `string` | Account Password(**Required**) |

Response

| Status  | Message                        | Success  | JWT Token      |
| :-      | :-                             | :-       | :-             |
| `201`   | Account Created Successfully | `true`   | `Received`     |
| `409`   | Email already taken          | `false`  | `Not Received` |
| `500`   | Server Issue                 | `false`  | `Received`     |

### User Signin

```http
  POST /user/signin
```
Request Body

| Body      | Type     | Description                    |
| :-        | :-       | :-                             |
| `email`   | `string` | Account Email(**Required**)    |
| `password`| `string` | Account Password(**Required**) |

Response

| Status  | Message                        | Success  | JWT Token      |
| :-      | :-                             | :-       | :-             |
| `201`   | Account Created Successfully | `true`   | `Received`     |
| `404`   | Account already taken          | `false`  | `Not Received` |
| `500`   | Server Issue                 | `false`  | `Received`     |

### Populate Category and Product tables

###### After signin or singup, you have to hit this endpoint so that you can get products and categories

```http
  POST /user/populateDB
```
Request

| Headers           | Type     | Description                    |
| :-                | :-       | :-                             |
| `Authorization`   | `string` | JWT Token(**Required**)    |


Response

| Status  | Message                        | Success  |
| :-      | :-                             | :-       |
| `200`   | Database Populated!          | `true`   |
| `500`   | Server Issue                 | `false`  |

### Available Categories



```http
  GET /store/category/list
```

Response

| Status  | Message                        |   Categories   |Success  |
| :-      | :-                             | :-             |:-       |
| `200`   | Database Populated!         |     Categories Array |`true`   |
| `500`   | Server Issue                 |        None    |`false`  |

#### Find products by category id

```http
  GET /store/product/filterByCategory/:categoryId
```
Request

| Params      | Type   |
| :-          | :-     |
| categoryId | Integer|


Response

| Status  | Message                        |   Products         |Success  |
| :-      | :-                             | :-                 |:-       |
| `200`   |                                |   Products Array   |`true`   |
| `404`   | No Products under given Category Id| | `false`
| `500`   | Server Issue                   |     None           |`false`  |

#### Find product by product id

```http
  GET /store/product/filterByProduct/:productId
```
Request

| Params      | Type   |
| :-          | :-     |
| productId | Integer|


Response

| Status  | Message                        |   Products         |Success  |
| :-      | :-                             | :-                 |:-       |
| `200`   |                                |   Products Array   |`true`   |
| `404`   | There isn't any Product with that Id| | `false`
| `500`   | Server Issue                   |     None           |`false`  |

#### Add Product and quantity to cart 

```http
  GET /user/cart/add/:productId/:quantity
```
Request

| Headers           | Type     | Description                    |
| :-                | :-       | :-                             |
| `Authorization`   | `string` | JWT Token(**Required**)    |

| Params      | Type   |
| :-          | :-     |
| categoryId  | Integer|
| quantity    | Integer|


Response

| Status  | Message                                 |Success  |
| :-      | :-                                |:-       |
| `200`   | Added to Cart!       |`true`   |
| `404`   | Product doesn't exist | `false`
| `404`   | Product Sold Out (OR) Low in Stock | `false`
| `500`   | Server Issue                             |`false`  |

#### Remove Product from the cart 

```http
  GET /user/cart/remove/:itemId
```
Request

| Headers           | Type     | Description                    |
| :-                | :-       | :-                             |
| `Authorization`   | `string` | JWT Token(**Required**)    |

| Params      | Type   | Description |
| :-          | :-     |:-|
| itemId  | Integer| id in the cart|


Response

| Status  | Message                                 |Success  |
| :-      | :-                                |:-       |
|`200`|Product removed from your Cart!| `true`|
| `404`   | Product is not in Cart. So cannot be removed       |`false`   |
| `500`   | Server Issue                             |`false`  |

#### View Cart

```http
  GET /user/cart/view
```
Request

| Headers           | Type     | Description                    |
| :-                | :-       | :-                             |
| `Authorization`   | `string` | JWT Token(**Required**)    |

Response

| Status  | Message       | Cart Items  | Success |
| :-      | :-            |:-           |:-       |
| `200`   |               | Items Array | `true`  |
| `200`   | Cart is Empty |`true`       | `true`  |
| `500`   | Server Issue  |`false`      | `false`|

#### Update Product quantity

```http
  GET /user/cart/update/:itemId/:quantity
```
Request

| Headers           | Type     | Description                    |
| :-                | :-       | :-                             |
| `Authorization`   | `string` | JWT Token(**Required**)    |

| Params      | Type   | Description |
| :-          | :-     |:-|
| itemId  | Integer| id in the cart|
| quantity  | Integer| |


Response

| Status  | Message                                 |Success  |
| :-      | :-                                |:-       |
| `200`   |  Updated!       |`true`   |
| `404`   | Product is not in Cart. | `false`|
| `500`   | Server Issue                             |`false`  |

#### Buy the product

```http
  GET /user/order/buy/:itemId
```
Request

| Headers           | Type     | Description                    |
| :-                | :-       | :-                             |
| `Authorization`   | `string` | JWT Token(**Required**)    |

| Params      | Type   | Description |
| :-          | :-     |:-|
| itemId  | Integer| id in the cart|


Response

| Status  | Message                                 |Success  |
| :-      | :-                                |:-       |
| `200`   |  Yay, you bought the product!       |`true`   |
| `404`   | Product is not in Cart. | `false`|
| `500`   | Server Issue                             |`false`  |

#### View Orders

```http
  GET /user/order/view
```
Request

| Headers           | Type     | Description                    |
| :-                | :-       | :-                             |
| `Authorization`   | `string` | JWT Token(**Required**)    |

Response

| Status  | Message       | Orders  | Success |
| :-      | :-            |:-           |:-       |
| `200`   | You haven't bought any product yet | | `true`|
| `200`   |               | Orders Array | `true`  |
| `500`   | Server Issue  |`false`      | `false`|

#### View Orders History

```http
  GET /user/order/history
```
Request

| Headers           | Type     | Description                    |
| :-                | :-       | :-                             |
| `Authorization`   | `string` | JWT Token(**Required**)    |

Response

| Status  | Message       | Orders   | Success |
| :-      | :-            |:-           |:-       |
| `200`   | You haven't bought any product yet | | `true`|
| `200`   |               | History Array | `true`  |
| `500`   | Server Issue  |`false`      | `false`|