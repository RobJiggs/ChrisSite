package com.clothing.start.controller;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.clothing.start.config.SecurityConfig;
import com.clothing.start.entity.Address;
import com.clothing.start.entity.Address.Status;
import com.clothing.start.entity.Cart;
import com.clothing.start.entity.CartItem;
import com.clothing.start.entity.Items;
import com.clothing.start.entity.OrderItem;
import com.clothing.start.entity.Orders;
import com.clothing.start.entity.Orders.status;
import com.clothing.start.entity.PasswordResetToken;
import com.clothing.start.entity.Users;
import com.clothing.start.repo.ItemRepo;
import com.clothing.start.service.AddressService;
import com.clothing.start.service.CartItemService;
import com.clothing.start.service.CartService;
import com.clothing.start.service.EmailService;
import com.clothing.start.service.ItemService;
import com.clothing.start.service.OrderItemService;
import com.clothing.start.service.OrderService;
import com.clothing.start.service.PasswordResetService;
import com.clothing.start.service.UserService;
import com.clothing.start.utility.ChangeQuantityRequest;
import com.clothing.start.utility.IPUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.oauth2.sdk.ParseException;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserController {
	
	@Autowired
	UserService userService;
	
	@Autowired
	OrderService orderService;
	
	@Autowired
	AddressService addressService;
	
	@Autowired
	CartService cartService;
	
	@Autowired
	CartItemService cartitemService;
	
	@Autowired
	OrderItemService orderitemService;
	
	@Autowired
	ItemService itemService;
	
	@Autowired
	PasswordResetService passwordResetService;
	
	@Autowired
	ItemRepo itemRepo;
	
	@Autowired
	EmailService emailService;
	
	@Autowired
	PasswordEncoder pwencoder;
	
	@GetMapping("/all")
	public List<Users> getAll(){
		
		
		return userService.getAllUsers();
		
	}
	
	
	@GetMapping("/findBy/user/{Username}")
	public Users findByUser(@PathVariable("Username") String Username) {
		
		return userService.getUserByUsername(Username);
		
		
	}
	@GetMapping("/findBy/email/{email}")
	public Users findByEmail(@PathVariable("email") String email) {
		
		return userService.getUserByEmail(email);
		
		
	}
	@GetMapping("findBy/{userid}")
	public Users findById(@PathVariable("userid") long userid) {
		
		return userService.getUsersByid(userid);
		
	}
	
	
	@PostMapping("/register")
	public Users Register(@RequestBody Users user) {
		Users u=new Users();
		u.setUserID(user.getUserID());
		u.setUserName(user.getUserName());
		u.setPassWord(user.getPassWord());
		
		System.out.print(user.getUserName()+"   hi   ");
	    u.setFirstName(user.getFirstName());
	    u.setLastName(user.getLastName());
		u.setPhoneNumber(user.getPhoneNumber());
		u.setEmail(user.getEmail());
		
		//u.setUserName("rob");
		//u.setPassWord("1234");
		//u.setFirstName("Robert");
		//u.setLastName("jay");
		//u.setPhoneNumber("213551512");
		//u.setEmail("gasgs");
		
		System.out.println(u.getUserName() +"user value is here");
		return userService.registerUser(u);
		
	}
	
	@PostMapping("/{userId}/change-info")
    public ResponseEntity<Users> changeUserInfo(
            @PathVariable long userId,
            @RequestBody Users updatedUser) {
        Users user = userService.getUsersByid(userId);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the user information
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setEmail(updatedUser.getEmail());
        user.setUserName(updatedUser.getUserName());

        // Save the updated user
        userService.saveUser(user);

        return ResponseEntity.ok(updatedUser);
    }
	
	
	@PostMapping("/forgot-password")
	public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
	    String email = request.getEmail();

	    // Find the user by email address
	    Users user = userService.getUserByEmail(email);
	    Map<String,String> hm= new HashMap<>();

	    if (user != null) {
	        // Check if the user has a password reset token
	        PasswordResetToken token = user.getPasswordResetToken();

	        if (token != null && token.isExpired()) {
	            // Delete the expired token
	            passwordResetService.delete(token);
	            token = null; // Set token to null to generate a new one
	        }

	        if (token == null) {
	            // Generate a new password reset token and set it for the user
	            token = passwordResetService.generateToken(user);
	        }

	        // Get the token value
	        String tokenValue = token.getToken();

	        // Send the password reset token to the user's email address
	        emailService.sendPasswordResetEmail(email, tokenValue);
	        
	        hm.put("Response Value","Password reset successful" );
	        return ResponseEntity.ok(hm);
	    } else {
	        // User not found with the provided email address
	    	hm.put("Response Value", "Invalid or expired token");
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(hm);
	    }
	}







	static class ForgotPasswordRequest {
	    private String email;

	    public ForgotPasswordRequest() {
	    }

	    public ForgotPasswordRequest(String email) {
	        this.email = email;
	    }

	    public String getEmail() {
	        return email;
	    }

	    public void setEmail(String email) {
	        this.email = email;
	    }
	}

	
	
	
	@PostMapping("/reset-password")
	public ResponseEntity<Map<String,String>> resetPassword(@RequestBody ResetPasswordRequest request) {
	    String token = request.getToken();
	    String newPassword = request.getNewPassword();
	    String encoderpw= pwencoder.encode(newPassword);

	    // Verify the validity of the password reset token
	    PasswordResetToken resetToken = passwordResetService.findByToken(token);
	    Map<String,String> hm= new HashMap<>();

	    if (resetToken != null && !resetToken.isExpired()) {
	        // Get the user associated with the token
	        Users user = resetToken.getUser();

	        // Update the user's password with the new password
	        userService.updatePassword(user, encoderpw);

	        // Delete the password reset token from the database
	        passwordResetService.delete(resetToken);
	        System.out.println("This works correctly rn ");
	        hm.put("Response Value","Password reset successful" );
	        return ResponseEntity.ok(hm);
	        
	    } else {
	        // Invalid or expired token
	    	hm.put("Response Value", "Invalid or expired token");
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(hm);
	    }
	}

	
	
	
	
	
	
	 static class ResetPasswordRequest {
	    private String token;
	    private String newPassword;

	    public String getToken() {
	        return token;
	    }

	    public void setToken(String token) {
	        this.token = token;
	    }

	    public String getNewPassword() {
	        return newPassword;
	    }

	    public void setNewPassword(String newPassword) {
	        this.newPassword = newPassword;
	    }
	}

	
	 
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	@GetMapping("/addressinfo/{userid}")
	public ResponseEntity<List<Address>> GetAddressesInfo(@PathVariable("userid") long userid){
		
		List<Address> addresses= new ArrayList<>();
		addresses=addressService.getAddressByUser(userid);
		
		
		return ResponseEntity.ok(addresses);
		
		
		
	}
	@GetMapping("/addressinfo/main/{userid}")
	public ResponseEntity<Address> GetMainAddresses(@PathVariable("userid") long userid){
		Address address=null;
		address=addressService.getMainAddress(userid);
		return ResponseEntity.ok(address);
		
		
		
	}
	
	
	@PostMapping("/add/address")
	public Address addAddress(@RequestBody String addressJson) {
	    System.out.println(addressJson);
	    System.out.println("this right here");
		ObjectMapper objectMapper = new ObjectMapper();
	    Address address = null;
	   
	    JsonNode jsonNode = null;
	    try {
	        jsonNode = objectMapper.readTree(addressJson);
	    } catch (JsonProcessingException e) {
	        e.printStackTrace();
	    }
	    System.out.println("this method works up to here");
	    long userId = jsonNode.get("user_id").asLong();
	    Users user = userService.getUsersByid(userId);
	    if (user == null) {
	        // Handle the case where the user does not exist
	        // You can return an error response or throw an exception
	        // depending on your application's requirements.
	        // For example:
	        throw new RuntimeException("User not found");
	    }

	    Address add = new Address();
	    add.setStreet(jsonNode.get("street").asText());
	    add.setCity(jsonNode.get("city").asText());
	    add.setState(jsonNode.get("state").asText());
	    add.setCountry(jsonNode.get("country").asText());
	    add.setStatus(Status.valueOf(jsonNode.get("status").asText()));
	    if(jsonNode.get("etc")!=null) {
	    	add.setEtc(jsonNode.get("etc").asText());
	    	
	    	
	    	
	    }
	    add.setEtc("");
	    
	    add.setZipcode(jsonNode.get("zipcode").asText());
	     // Set the user in the address
	    Set<Users> users = new HashSet<>();
	    users = add.getUsers();  // Get the current set of users
	    users.add(user);  // Add the current user to the set
	    add.setUsers(users);  // Update the set of users in the address object
	    //add.setUsers(new HashSet<>(Collections.singletonList(user)));

	    return addressService.add(add);
	}
	
	@PutMapping("/change/addresses")
	public ResponseEntity<String> changeAddresses(@RequestBody List<Address> updatedAddresses){
		
		for (Address address : updatedAddresses) {
			
			
			 Optional<Address> existingAddressOptional = Optional.ofNullable(addressService.getAddresssByid(address.getAddyid()));
	            if (existingAddressOptional.isPresent()) {
	                Address existingAddress = existingAddressOptional.get();
	                // Update the necessary fields of the existing address with the values from the updated address
	                existingAddress.setStreet(address.getStreet());
	                existingAddress.setCity(address.getCity());
	                existingAddress.setState(address.getState());
	                existingAddress.setEtc(address.getEtc());
	                existingAddress.setCountry(address.getCountry());
	                existingAddress.setZipcode(address.getZipcode());
	                // Save the updated address
	                addressService.add(existingAddress);
	            }
		}
		
		
		return ResponseEntity.ok("Addresses updated successfully");
		
		
		
	}

	
	@PutMapping("/change/address")
	public ResponseEntity<Address> changeAddress(@RequestBody Address address ){
		Address add= new Address();
		add = addressService.getAddresssByid(address.getAddyid());
		
		add.setStreet(address.getStreet());
		add.setCity(address.getCity());
		add.setState(address.getState());
	
		add.setCountry(address.getCountry());
		add.setStatus(address.getStatus());
		add.setEtc(address.getEtc());
		add.setZipcode(address.getZipcode()); 
		    
		    // Get the user from the address object and add it to the new address object
		 
		    
		    addressService.add(add);
	
		
		return ResponseEntity.ok(add);
		
		
		
		
	}
	
	
	@PostMapping("/login")
	public ResponseEntity<?> AuthLog(@RequestBody Map<String, String> loginRequest){
		String username=loginRequest.get("username");
		String password=loginRequest.get("password");
		
		
		
		boolean auth=userService.authenticateUser(username, password);
	
		 if (auth) {
		        return ResponseEntity.ok().body("{\"message\": \"Login successful\"}");
		    }

		    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Invalid username or password\"}");
		
	}
	
	@PostMapping("/login/email")
	public ResponseEntity<?> AuthLogEmail(@RequestBody Map<String, String> loginRequest){
		String email=loginRequest.get("email");
		String password=loginRequest.get("password");
		
		boolean auth=userService.authenticateUserEmail(email, password);
		 if (auth) {
		        return ResponseEntity.ok().body("{\"message\": \"Login successful\"}");
		    }

		    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Invalid username or password\"}");
	}
	
	
	@GetMapping("/orders/user/{orderid}")
	public Users GetUserByOrder(@PathVariable("orderid") long orderid) {
		
		
		Orders order=new Orders();
		order=orderService.getOrdersByid(orderid);
		Users user=order.getUser();
		return user;
		
	}
	@GetMapping("/orders/{customerid}")
	public List<Orders> GetOrdersByUser(@PathVariable("customerid") long customerid) {
		
		
		List<Orders> orders=new ArrayList<>();
		orders=orderService.getOrdersByCustomer(customerid);
		
		return orders;
		
	}
	
	@GetMapping("/cart/{cartid}")
	public List<CartItem> GetUserCart(@PathVariable("cartid") long cartid) {
		
		
		Cart cart= new Cart();
		cart=cartService.getCartById(cartid);
		List<CartItem> allItems= new ArrayList<>();
		allItems=cartitemService.getCartItems(cart.getCartID());
		return allItems;
		
	}
	
	@GetMapping("/order/{orderid}")
	public Orders GetOrder(@PathVariable("orderid") long orderid) {
		
		
		Orders order = orderService.getOrdersByid(orderid);
		
		return order;
		
	}
	
	
	
	@GetMapping("/orderitems/{orderid}")
	public List<OrderItem> GetOrdersItems(@PathVariable("orderid") long orderid) {
		
		
		Orders order=new Orders();
		order=orderService.getOrdersByid(orderid);
		List<OrderItem> allItems= new ArrayList<>();
		allItems=orderitemService.getUserOrder(order.getOrderNumber());
		return allItems;
		
	}
	
	@GetMapping("/orderItems/totalPrice/{orderId}")
	  public double getOrderItemsTotalPrice(@PathVariable("orderId") long orderId) {
	    List<OrderItem> orderItems = orderitemService.getUserOrder(orderId);
	    double totalPrice = orderItems.stream()
	        .mapToDouble(orderItem -> orderItem.getQuantity() * orderItem.getPrice())
	        .sum();
	    return totalPrice;
	  }
	
	
	@GetMapping("/items/orders/info/{orderitemid}")
	public Items getOItemInfo(@PathVariable("orderitemid")long orderitemid) {
		
		OrderItem oi= new OrderItem();
		oi=orderitemService.getById(orderitemid);
		Items i= new Items();
		i=oi.getItem();
		System.out.println(i.getItemName()+"item blah blah");
		return i;
		
		
		
	}
	
	
	
	@PostMapping("/{orderId}/{email}/send-confirmation-email")
    public ResponseEntity<String> sendOrderConfirmationEmail(@PathVariable("orderId") Long orderId,@PathVariable("email") String email) {
        // Get the order details from the database using the orderId
        Orders order = orderService.getOrdersByid(orderId);

        // Generate the HTML content for the email using the order details
        String emailContent = generateOrderConfirmationEmailContent(order);

        // Send the email
        emailService.sendOrderConfirmationEmail(email, "Order Confirmation", emailContent);

        return ResponseEntity.ok("Order confirmation email sent");
    }

    private String generateOrderConfirmationEmailContent(Orders order) {
    	  StringBuilder emailContentBuilder = new StringBuilder();
    	    emailContentBuilder.append("<html><body>");
    	    emailContentBuilder.append("<h2>Order Confirmation</h2>");
    	    emailContentBuilder.append("<p>Order Number: ").append(order.getOrderNumber()).append("</p>");
    	    emailContentBuilder.append("<p>Ship to: ").append(order.getShipto()).append("</p>");
    	    emailContentBuilder.append("<p>Shipping Address: ").append(order.getAddressDetails()).append("</p>");
    	    emailContentBuilder.append("<h3>Order Items</h3>");
    	    emailContentBuilder.append("<ul>");
    	    for (OrderItem orderItem : order.getOrderItems()) {
    	        emailContentBuilder.append("<li>");
    	        emailContentBuilder.append("<img src=\"").append(orderItem.getItem().getImage()).append("\" alt=\"Item Image\"/>");
    	        emailContentBuilder.append("<div class=\"item-info\">");
    	        Items item=orderItem.getItem();
    	        if(item.getSex()=="Male") {
    	        emailContentBuilder.append("<p class=\"item-name\">").append(item.getSize()+"Men's "+orderItem.getItem().getItemName()).append("</p>");
    	        }
    	        else if(item.getSex()=="Female"){
    	        	emailContentBuilder.append("<p class=\"item-name\">").append(item.getSize()+"Women's "+orderItem.getItem().getItemName()).append("</p>");
    	        	
    	        	
    	        }
    	        emailContentBuilder.append("</div>");
    	        emailContentBuilder.append("<p class=\"item-price\">$").append(orderItem.getPrice())
    	                .append(" X ").append(orderItem.getQuantity()).append("</p>");
    	        emailContentBuilder.append("</li>");
    	    }
    	    emailContentBuilder.append("</ul>");
    	    emailContentBuilder.append("<p>Total Price: $").append(order.getTotalPrice()).append("</p>");
    	    emailContentBuilder.append("</body></html>");

    	    return emailContentBuilder.toString();
        
    }



	  @GetMapping("/cartItems/totalPrice/{cartId}")
	  public double getCartItemsTotalPrice(@PathVariable("cartId") long cartId) {
	    List<CartItem> cartItems = cartitemService.getCartItems(cartId);
	    double totalPrice = cartItems.stream()
	        .mapToDouble(cartItem -> cartItem.getQuantity() * cartItem.getPrice())
	        .sum();
	    return totalPrice;
	  }
	
	@GetMapping("/items/all")
	public List<Items> GetAllItems(){
		
		return itemService.getAllItems();
		
		
		
	}
	@GetMapping("/find/name/items/{itemname}")
	public List<Object[]> getItembyName(@PathVariable("itemname") String itemname){
		
		return itemService.findSizesAndColorsByExactItemName(itemname);
		
		
		
	}
	
	@PostMapping("/create/cart/{userId}")
	public ResponseEntity<Cart> CreateCart(@PathVariable("userId") long userId) {
		
		 Users user = userService.getUsersByid(userId);
		    
		    // Check if the user already has a cart
		    Cart existingCart = user.getCart();
		    if (existingCart != null) {
		        // A cart already exists for the user
		        return ResponseEntity.ok(existingCart);
		    }
		    
		    // Create a new cart for the user
		    Cart cart = new Cart();
		    java.sql.Date sqlDate = new java.sql.Date(System.currentTimeMillis());
		    cart.setCreated_at(sqlDate);
		    cart.setUpdated_at(sqlDate);
		    cart.setUser(user);
		    cartService.saveCart(cart);
		    
		    return ResponseEntity.ok(cart);
		
	}
	
	@PostMapping("/create/cart/guest")
    public ResponseEntity<Cart> createCart(@RequestBody String ipAddress) {
       
       
        Cart existingCart = cartService.getGuestCart(ipAddress);
        
        if (existingCart != null) {
	        // A cart already exists for the user
        	
	        return ResponseEntity.ok(existingCart);
	    }
        Cart cart = new Cart();
	    java.sql.Date sqlDate = new java.sql.Date(System.currentTimeMillis());
	    cart.setCreated_at(sqlDate);
	    cart.setUpdated_at(sqlDate);
	    cart.setipAddress(ipAddress);
	    cartService.saveCart(cart);
	    System.out.println(cart + "this cart is correct and working");
	    return ResponseEntity.ok(cart);
    }
	
	
	
	@PostMapping("/cart/additems")
	public CartItem addCartItem(@RequestBody String CartDetails ){
		ObjectMapper objectMapper = new ObjectMapper();
		CartItem cartItem = null;
		
		JsonNode jsonNode = null;
		try {
			jsonNode = objectMapper.readTree(CartDetails);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		long itemId = jsonNode.get("item_id").asInt();
		long cartId= jsonNode.get("cart_id").asInt();
		cartItem= new CartItem();
		
		
		cartItem.setQuantity(jsonNode.get("quantity").asInt());
		Cart cart= new Cart();
		cart=cartService.getCartById(cartId);
		cartItem.setCart(cart);
		
		Items item= itemService.getItemByid(itemId);
		cartItem.setPrice(item.getPrice());
		cartItem.setItem(item);
		
		
		itemService.saveItem(item);
		
		return cartitemService.saveci(cartItem);
		
		
	
		
	}
	
	@PostMapping("/create/order")
	public ResponseEntity<Orders> addOrderItems(@RequestBody String CartDetails ){
		
		//get the cart id
		ObjectMapper objectMapper = new ObjectMapper();
		
		
		JsonNode jsonNode = null;
		try {
			jsonNode = objectMapper.readTree(CartDetails);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		long cartId= jsonNode.get("cart_id").asInt();
		Cart cart= new Cart();
		cart=cartService.getCartById(cartId);
		Users user= cart.getUser();
		
		//create the orders
		Orders order= new Orders();
		
		
		order.setStatus(status.valueOf("CONFIRMED"));
		
		String AddDetails=  jsonNode.get("addy_details").asText();
		double totalprice=jsonNode.get("total_price").asDouble();
		String shipto=jsonNode.get("shipto").asText();
		
		
		order.setAddressDetails(AddDetails);
		java.sql.Date sqlDate = new java.sql.Date(System.currentTimeMillis());
		order.setDateOfOrder(sqlDate);
		order.setStatusMessage("Your order is Confirmed Updates will come soon");
		if(user!=null) {
		order.setUser(user);
	
		
		
		}
		
		order.setShipto(shipto);
		order.setTotalPrice(totalprice);
		orderService.saveOrder(order);
		//find all cartItems in the cart
		List<CartItem> allitems= new ArrayList<>();
		allitems=cartitemService.getCartItems(cartId);
		
		//make all cartItems to orderItems
		for (CartItem cartItem : allitems) {
			OrderItem OI = new OrderItem(); 
			Items item=cartItem.getItem();
			OI.setPrice( cartItem.getPrice());
			OI.setQuantity(cartItem.getQuantity());
			
			OI.setItem(cartItem.getItem());
			OI.setOrder(order);
			orderitemService.saveOrderItem(OI);
		}
		//delete all cartItems
		
		for (CartItem cartItem : allitems) {
			cartitemService.deleteCI(cartItem);
		}
		
		return ResponseEntity.ok(order);
	}
	
	
	@GetMapping("/items/search/category/{catname}")
	public ResponseEntity<List<Items>> SearchByCat(@PathVariable("catname") String catname){
		List<Items> cat= new ArrayList<>();
		cat=itemService.itemCategory(catname);
		return ResponseEntity.ok(cat);
		
	}
	@GetMapping("/items/search/color/{color}")
	public ResponseEntity<List<Items>> SearchByColor(@PathVariable("color") String color){
		List<Items> colorlist= new ArrayList<>();
		colorlist=itemService.itemColor(color);
		return ResponseEntity.ok(colorlist);
		
	}
	
	@GetMapping("/items/search/price/{maxprice}/{minprice}")
	public ResponseEntity<List<Items>> SearchByColor(@PathVariable("maxprice") double maxprice,@PathVariable("minprice") double minprice){
		List<Items> pricelist= new ArrayList<>();
		pricelist=itemService.itemPrice(minprice, maxprice);
		return ResponseEntity.ok(pricelist);
		
	}
	
	@GetMapping("/items/search")
	public ResponseEntity<List<Items>> searchItems(
	        @RequestParam(required = false) String sex,
	        @RequestParam(required = false) String category,
	        @RequestParam(required = false) String color,
	        @RequestParam(required = false) Double minPrice,
	        @RequestParam(required = false) Double maxPrice,
	        @RequestParam(required = false) String size,
	        @RequestParam(required = false) String itemName,
	        @RequestParam(required = false) String dateAdded,
	        @RequestParam(required = false) Boolean featured,
	        @RequestParam(required = false) Boolean available
	) throws ParseException {
	    // Convert the dateAdded string to a Date object if needed
	    Date dateAddedValue = null;
	    if (dateAdded != null) {
	        try {
	            dateAddedValue = (Date) new SimpleDateFormat("yyyy-MM-dd").parse(dateAdded);
	        } catch (java.text.ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    }

	    // Call the repository method with the request parameters
	    List<Items> items = itemRepo.findByAttributes(sex, category, color, minPrice, maxPrice, size, itemName, dateAddedValue,featured,available);
	    return ResponseEntity.ok(items);
	}
	
	
	public List<Items> readItemsFromCSV(MultipartFile csvFile) {
	    List<Items> itemsList = new ArrayList<>();

	    try {
	        InputStream inputStream = csvFile.getInputStream();
	        CSVReader csvReader = new CSVReaderBuilder(new InputStreamReader(inputStream)).withSkipLines(1).build();

	        String[] line;
	        while ((line = csvReader.readNext()) != null) {
	            Items item = new Items();
	            // Assuming that the CSV columns are in the same order as the Item class attributes
	            item.setItemName(line[0]);
	            item.setSex(line[1]);
	        	item.setCategory(line[2]);
	        	item.setColor(line[3]);
	        	item.setPrice(Double.parseDouble(line[4]));
	        	item.setSize(line[5]);
	        	item.setImage(line[6]);
	        
	         	
	        	item.setAvailable(Boolean.parseBoolean(line[7]));
	        	item.setFeatured(Boolean.parseBoolean(line[8]));
	        	
	        	
	        	
	            // Set other attributes as needed
	            itemsList.add(item);
	        }

	        csvReader.close();
	    } catch (Exception e) {
	        e.printStackTrace();
	        // Handle exceptions appropriately
	    }

	    return itemsList;
	}

	@PostMapping("/create/items")
	public ResponseEntity<List<Items>> createItems(@RequestBody MultipartFile csvFile) {
		
	    List<Items> items = new ArrayList<>();
	    items=readItemsFromCSV(csvFile);
	    for (Items item : items) {
	        itemRepo.save(item);
	    	
	        
	    }

	    return ResponseEntity.ok(items);
	}
	
	
	
	@GetMapping("/items/search/name/{itemName}")
	public ResponseEntity<List<Items>> itemContaining(@PathVariable("itemName") String itemName){
		 
		
		List<Items> namelist= new ArrayList<>();
		namelist=itemService.itemNameContaining(itemName);
		return ResponseEntity.ok(namelist);
		
		
	} 
	
	@GetMapping("/items/{id}")
	
	public Items searchItembyID(@PathVariable("id") Long id)
	{
		return itemService.getItemByid(id);
		
		
		
		
		
	}
	
@GetMapping("/items/search/featured")
	
	public ResponseEntity<List<Items>> searchFeaturedItem()
	{
		
		
	List<Items> featlist= new ArrayList<>();
	featlist=itemService.itemFeatured();
	return ResponseEntity.ok(featlist);
	
		
		
	}

@GetMapping("/items/cart/info/{cartitemid}")
public Items getItemInfo(@PathVariable("cartitemid")long cartitemid) {
	
	CartItem ci= new CartItem();
	ci=cartitemService.getById(cartitemid);
	Items i= new Items();
	i=ci.getItem();
	return i;
	
	
	
}



@PutMapping("/cartitem/change/quantity/{cartitemid}")
public ResponseEntity<CartItem> changeQuantity(@PathVariable("cartitemid") long cartitemid, @RequestBody ChangeQuantityRequest request) {
    // Extract the quantity from the request object
    int quantity = request.getQuantity();

    // Your remaining code
    CartItem ci = cartitemService.getById(cartitemid);
    ci.setQuantity(quantity);
    cartitemService.saveci(ci);
    return ResponseEntity.ok(ci);
}






@PostMapping
("/cartitem/add")
public CartItem createCartItem(@RequestBody Map<String, String> itemRequest) {
	
	String name=itemRequest.get("name");
	String color=itemRequest.get("color");
	String sex=itemRequest.get("sex");
	String size=itemRequest.get("size");
	String cartIdtemp=itemRequest.get("cartID");
	Long cartID = Long.parseLong(cartIdtemp);
	Items item=new Items();
	item=itemService.ItemsForCart(name, color, sex, size);
	Cart cart= new Cart();
	cart=cartService.getCartById(cartID);
	CartItem cartItem= new CartItem();
	cartItem.setQuantity(1);
	cartItem.setPrice(item.getPrice());
	cartItem.setItem(item);
	cartItem.setCart(cart);
	return cartitemService.saveci(cartItem);
	
	
	
}
@PostMapping
("/cartitem/quantity/add")
public CartItem createCartItemQuantity(@RequestBody Map<String, String> itemRequest) {
	
	String name=itemRequest.get("name");
	String color=itemRequest.get("color");
	String sex=itemRequest.get("sex");
	String size=itemRequest.get("size");
	int quantity=Integer.parseInt(itemRequest.get("quantity"));
	
	System.out.println(quantity);
	
	
	String cartIdtemp=itemRequest.get("cartID");
	Long cartID = Long.parseLong(cartIdtemp);
	Items item=new Items();
	item=itemService.ItemsForCart(name, color, sex, size);
	Cart cart= new Cart();
	cart=cartService.getCartById(cartID);
	CartItem cartItem= new CartItem();
	cartItem.setQuantity(quantity);
	cartItem.setPrice(item.getPrice());
	cartItem.setItem(item);
	cartItem.setCart(cart);
	return cartitemService.saveci(cartItem);
	
	
	
}






@GetMapping("/item/details/{name}/{color}/{sex}/{size}")
public Items itembyCharacteristic(@PathVariable("name") String name,@PathVariable("color") String color, @PathVariable("sex") String sex,@PathVariable("size") String size) {
	Items item=new Items();
	item=itemService.ItemsForCart(name, color, sex, size);
	return item;
	
	
	
}


@DeleteMapping("/cartitem/delete/{cartitemid}")
public ResponseEntity<Void> DeleteCartItem(@PathVariable("cartitemid")long cartitemid){
	
	Optional<CartItem> itemOptional = Optional.of(cartitemService.getById(cartitemid));
	
	if (itemOptional.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
	cartitemService.delete(itemOptional.get());

	
	
	return ResponseEntity.noContent().build();
	
	
}

@GetMapping("/item/{name}/{color}/{sex}/sizes")
public List<String> getItemSizes(@PathVariable String name, @PathVariable String color,@PathVariable String sex) {
    return itemService.ItemSizes(name, color,sex);
}



@GetMapping("/states")
public List<String> getStates(@RequestBody String country){
	
	

        Locale[] locales = Locale.getAvailableLocales();
        List<String> states = new ArrayList<>();

        for (Locale locale : locales) {
            if (locale.getCountry().equals(country)) {
                String state = locale.getDisplayVariant(Locale.ENGLISH);
                if (!state.isEmpty()) {
                    states.add(state);
                }
            }
        }

        return states;
    
	
	
	
	
	
}







	
}
