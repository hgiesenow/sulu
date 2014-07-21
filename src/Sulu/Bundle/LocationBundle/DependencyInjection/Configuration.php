<?php
/*
 * This file is part of the Sulu CMS.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\LocationBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('sulu_location')
            ->children()
                ->arrayNode('types')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('location')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('template')
                                    ->defaultValue('SuluLocationBundle:Template:content-types/location.html.twig')
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('enabled_providers')
                    ->prototype('scalar')->end()
                    ->defaultValue(array('leaflet', 'google'))
                ->end()
                ->enumNode('default_provider')
                    ->values(array('leaflet', 'google'))
                    ->defaultValue('leaflet')
                ->end()
                ->arrayNode('providers')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('leaflet')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('title')->defaultValue('Leaflet (OSM)')->end()
                                ->enumNode('geolocator')
                                    ->values(array('nominatim', 'google'))
                                    ->defaultValue('nominatim')
                                ->end()
                            ->end()
                        ->end()
                        ->arrayNode('google')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('title')->defaultValue('Google Maps')->end()
                                ->scalarNode('api_key')->defaultNull()->end()
                                ->enumNode('geolocator')
                                    ->values(array('nominatim', 'google'))
                                    ->defaultValue('nominatim')
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('geolocators')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('nominatim')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('endpoint')->defaultValue('http://open.mapquestapi.com/nominatim/v1/search.php')->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}
