// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'docs_page_config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DocsPageConfig _$DocsPageConfigFromJson(Map<String, dynamic> json) =>
    DocsPageConfig(
      name: json['name'] as String?,
      theme: json['theme'] as String?,
      docsearch: json['docsearch'] == null
          ? null
          : DocSearch.fromJson(json['docsearch'] as Map<String, dynamic>),
      twitter: json['twitter'] as String?,
      sidebar:
          (json['sidebar'] as List<dynamic>?)?.map((e) => e as Object).toList(),
      googleTagManager: json['googleTagManager'] as String?,
      experimentalCodeHike: json['experimentalCodeHike'] as bool?,
      experimentalMath: json['experimentalMath'] as bool?,
      references: json['references'] as String?,
      typedocEntryDir: json['typedocEntryDir'] as String?,
    );

Map<String, dynamic> _$DocsPageConfigToJson(DocsPageConfig instance) =>
    <String, dynamic>{
      'name': instance.name,
      'theme': instance.theme,
      'twitter': instance.twitter,
      'sidebar': instance.sidebar,
      'docsearch': instance.docsearch,
      'googleTagManager': instance.googleTagManager,
      'experimentalCodeHike': instance.experimentalCodeHike,
      'experimentalMath': instance.experimentalMath,
      'references': instance.references,
      'typedocEntryDir': instance.typedocEntryDir,
    };

DocSearch _$DocSearchFromJson(Map<String, dynamic> json) => DocSearch(
      apiKey: json['apiKey'] as String,
      indexName: json['indexName'] as String,
    );

Map<String, dynamic> _$DocSearchToJson(DocSearch instance) => <String, dynamic>{
      'apiKey': instance.apiKey,
      'indexName': instance.indexName,
    };
