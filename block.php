<?php
$block_sizes = get_the_terms($post->ID, 'block_sizes');
$post_formats = get_the_terms( $post->ID, 'post_formats' );
$post_contains = get_the_terms( $post->ID, 'post_contains' );
if (!empty($post_formats)) {
	$post_formats = array_map(function($term) { return $term->name; }, $post_formats );
}
if (!empty($post_contains)) {
	$post_contains = array_map(function($term) { return $term->name; }, $post_contains );
}
?>
<?php if (has_post_thumbnail( $post->ID ) && $block_sizes): ?>
<?php $block_size = reset($block_sizes)->slug; ?>
<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'single-post-thumbnail' ); ?>
<a class="block-link" href="<?php echo get_permalink( $post->ID ); ?>">
<div class="<?php echo strtolower($block_size) . ' ' . strtolower(implode(' ', $post_contains)); ?> block" style="background-image: url('<?php echo $image[0]; ?>')">
	<div class="post-info">
		<?php if ( ! empty( $post_formats ) ): ?>
		<span class="post-contains-icons">
			<?php foreach ( $post_formats as $format ): ?>
			<img src="<?php echo get_stylesheet_directory_uri() . '/images/' . $format . '.png'; ?>" alt="Post contains <?php echo $format; ?>" />
			<?php endforeach; ?> 
		</span>
		<?php endif; ?>
		<span class="post-title"><?php the_title(); ?></span>
		<div class="post-excerpt"><?php echo strip_tags(get_the_excerpt()); ?></div>
	</div>
</div>
</a>
<?php endif; ?>
