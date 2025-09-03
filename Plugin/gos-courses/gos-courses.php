<?php
/**
 * Plugin Name: GOS Courses
 * Description: Registers a 'course' post type with REST-exposed meta fields.
 * Version: 1.0.0
 */

if ( ! defined('ABSPATH') ) { exit; }

register_activation_hook(__FILE__, function(){ flush_rewrite_rules(); });
register_deactivation_hook(__FILE__, function(){ flush_rewrite_rules(); });

add_action('init', function () {
  register_post_type('course', [
    'label'         => 'Courses',
    'labels'        => [
      'name'          => 'Courses',
      'singular_name' => 'Course',
      'add_new_item'  => 'Add New Course',
      'edit_item'     => 'Edit Course',
      'menu_name'     => 'Courses',
    ],
    'public'        => true,
    'show_ui'       => true,
    'show_in_rest'  => true,
    'menu_position' => 5,
    'menu_icon'     => 'dashicons-welcome-learn-more',
    'supports'      => ['title','editor','thumbnail'],
    'has_archive'   => false,
    'rewrite'       => ['slug' => 'courses'],
  ]);
});

add_action('init', function(){
  $fields = [
    ['price', 'number'],
    ['tutorcount', 'number'],
    ['popular', 'boolean'],
  ];
  foreach ($fields as [$key, $type]) {
    register_post_meta('course', $key, [
      'type'          => $type,
      'single'        => true,
      'show_in_rest'  => true,     
      'auth_callback' => '__return_true',
    ]);
  }
});

add_action('rest_api_init', function() {
  if ( ! function_exists('get_field') ) return; 
  register_rest_field('course', 'acf', [
    'get_callback' => function($object) {
      return [
        'price'      => get_field('price', $object['id']),
        'tutorcount' => get_field('tutorcount', $object['id']),
        'popular'    => get_field('popular', $object['id']),
      ];
    },
    'schema' => null,
  ]);
});
add_action('rest_api_init', function () {
  register_rest_route('gos/order', '/submit', [
    'methods'  => 'POST',
    'callback' => function (WP_REST_Request $req) {
      $data = [
        'firstName' => sanitize_text_field($req->get_param('firstName')),
        'lastName'  => sanitize_text_field($req->get_param('lastName')),
        'email'     => sanitize_email($req->get_param('email')),
        'phone'     => sanitize_text_field($req->get_param('phone')),
        'studentAge'=> sanitize_text_field($req->get_param('studentAge')),
        'preferredTime' => sanitize_text_field($req->get_param('preferredTime')),
        'goals'     => sanitize_text_field($req->get_param('goals')),
        'paymentMethod' => sanitize_text_field($req->get_param('paymentMethod')),
        'cardNumber'=> sanitize_text_field($req->get_param('cardNumber')),
        'expiryDate'=> sanitize_text_field($req->get_param('expiryDate')),
        'cvv'       => sanitize_text_field($req->get_param('cvv')),
        'billingAddress'=> sanitize_text_field($req->get_param('billingAddress')),
        'agreeTerms'=> (bool)$req->get_param('agreeTerms'),
        'agreeNewsletter'=> (bool)$req->get_param('agreeNewsletter'),
      ];

      // (اختياري) خزّن الطلب كـ post لعرضه في الـ Dashboard
      if (!post_type_exists('gos_order')) {
        register_post_type('gos_order', ['label'=>'Orders','public'=>false,'show_ui'=>true,'supports'=>['title']]);
      }
      $post_id = wp_insert_post([
        'post_type'   => 'gos_order',
        'post_title'  => "Order: {$data['firstName']} {$data['lastName']}",
        'post_status' => 'publish',
      ]);
      if (!is_wp_error($post_id)) {
        foreach ($data as $k=>$v) update_post_meta($post_id, $k, $v);
      }

      return new WP_REST_Response(['ok'=>true,'order_id'=>$post_id], 200);
    },
    'permission_callback' => '__return_true', // للديمو فقط
  ]);
});
