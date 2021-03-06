<?php

function ting_search_autocomplete($query = NULL) {
  $query = $_GET['query'];
  $return = array();
  $delimiter = 0;

  if ($query == TRUE) {
    $cache = cache_get(md5($query), 'cache_ting_search_autocomplete');
    if ($cache instanceof stdClass && is_array($cache->data)) {
      $return = $cache->data;
    }
    else {
      require_once drupal_get_path('module', 'ting') . '/ting.client.inc';

      $terms = array();

      // Scan for search results
      $scan_results = ting_do_scan($query, 'anyIndexes', 10);
      if ($scan_results) {
        if (is_array($scan_results->terms)) {
          foreach ($scan_results->terms as $term) {
            $terms['any'][strtolower($term->name)] = $term;
          }
          uasort($terms['any'], 'ting_search_autocomplete_term_sort');
          $terms['any'] = array_reverse($terms['any']);
        }

        // Scan for spell suggestions
        $spell_suggestions = ting_get_spell_suggestions($query, 3);
        foreach ($spell_suggestions as $spell_word) {
          if (strtolower($spell_word->word) == strtolower($query)) {
            continue;
          }
          $spell_word->count = $spell_word->weight;
          $spell_word->name  = $spell_word->word;
          $terms['spell'][$spell_word->word] = $spell_word;
        }

        foreach ($terms as $type => $row) {
          if (is_array($row)) {
            foreach ($row as $term) {
              $value = ting_search_autocomplete_substr_word_bondary($term->name);
              if ($type == 'spell') {
                $return[] = array(
                  'id'    => $term->name,
                  'value' => $value,
                  'label' => t('Did you mean \'@query\' ?', array('@query' => $term->name)),
                );
              }
              else {
                $return[] = array(
                  'id'    => $term->name,
                  'value' => $value,
                  'label' => $term->name,
                );
              }
            }
          }
        }

        cache_set(md5($query), $return, 'cache_ting_search_autocomplete', CACHE_TEMPORARY);
      }
    }
  }
  drupal_json_output($return);
}

function ting_search_autocomplete_term_sort($t1, $t2) {
  if ($t1->count > $t2->count) {
    return 1;
  }
  elseif ($t2 > $t1->count) {
    return -1;
  }
  else {
    return 0;
  }
}

function ting_search_autocomplete_substr_word_bondary($text, $max = 128) {
  global $multibyte;
  $strlen = drupal_strlen($text);

  if ($strlen <= $max) {
    return $text;
  }
  else {
    if ($multibyte == UNICODE_MULTIBYTE) {
      if (mb_strpos($text, ' ', $max) == $max + 1) {
        $lastspace = $max;
      }
      else {
        $lastspace = mb_strrpos($text, ' ', $max - $strlen);
      }
    }
    else {
      if (strpos($text, ' ', $max) == $max + 1) {
        $lastspace = $max;
      }
      else {
        $lastspace = strrpos($text, ' ', $max - $strlen);
      }
    }

    return drupal_substr($text, 0, $lastspace);
  }
}
