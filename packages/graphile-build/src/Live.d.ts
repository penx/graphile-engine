// @flow
/* eslint-disable flowtype/no-weak-types */
import { GraphQLResolveInfo } from "graphql";

type SubscriptionReleaser = () => void;
type SubscriptionCallback = () => void;

export class LiveSource {
  subscribeCollection(
    _callback: SubscriptionCallback,
    _collectionIdentifier: any,
    _predicate?: (record: any) => boolean
  ): SubscriptionReleaser | null;

  subscribeRecord(
    _callback: SubscriptionCallback,
    _collectionIdentifier: any,
    _recordIdentifier: any
  ): SubscriptionReleaser | null;
}

export class LiveProvider {
  sources: Array<LiveSource>;
  namespace: string;

  constructor(namespace: string);

  registerSource(source: LiveSource): void;

  collectionIdentifierIsValid(_collectionIdentifier: any): boolean;

  recordIdentifierIsValid(
    _collectionIdentifier: any,
    _recordIdentifier: any
  ): boolean;
}

export class LiveMonitor {
  providers: { [namespace: string]: LiveProvider };
  subscriptionReleasers: (() => void)[];

  constructor(providers: { [namespace: string]: LiveProvider });

  reset(): void;
  release(): void;
  handleChange(): void;
  onChange(callback: () => void): void;
  liveCollection(
    info: GraphQLResolveInfo,
    namespace: string,
    collectionIdentifier: any,
    predicate?: (record: any) => boolean
  ): void;

  liveRecord(
    info: GraphQLResolveInfo,
    namespace: string,
    collectionIdentifier: any,
    recordIdentifier: any
  ): void;
}

export class LiveCoordinator {
  providers: { [namespace: string]: LiveProvider };

  registerProvider(provider: LiveProvider): void;

  registerSource(namespace: string, source: LiveSource): void;

  getMonitorAndContext(): {
    monitor: LiveMonitor;
    context: any;
  };

  subscribe(
    _parent: any,
    _args: any,
    context: any,
    _info: GraphQLResolveInfo
  ): AsyncIterable<void>;
}

export function makeAsyncIteratorFromMonitor(
  monitor: LiveMonitor
): AsyncIterable<void>;